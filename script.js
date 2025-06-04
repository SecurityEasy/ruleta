let items = [];
const token = new URLSearchParams(window.location.search).get("token");
const type = new URLSearchParams(window.location.search).get("t");

// Initialize variables that will be set in initApp()
let app, centerX, centerY, radius, wheelContainer;

async function initApp() {
  const container = document.getElementById("wheel-container");
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  app = new PIXI.Application({
    width: containerWidth,
    height: containerHeight,
    backgroundColor: 0x121212,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  container.innerHTML = "";
  container.appendChild(app.view);

  centerX = app.screen.width / 2;
  centerY = app.screen.height / 2;
  radius = Math.min(centerX, centerY) * 0.8;

  const winnerIndex = items.findIndex((item) => item.winner);
  const segmentAngle = (2 * Math.PI) / items.length;

  wheelContainer = new PIXI.Container();
  wheelContainer.position.set(centerX, centerY);
  app.stage.addChild(wheelContainer);
  if (!type) {
    alert("url invalida");
    return;
  }
  items = await getPrizes(type);
  createWheel();
  createPointer();
}

function createWheel() {
  const rim = new PIXI.Graphics();
  rim.lineStyle(10, 0x333333);
  rim.drawCircle(0, 0, radius + 5);
  wheelContainer.addChild(rim);

  const segmentAngle = (2 * Math.PI) / items.length;
  const fontSize = Math.max(13, radius * 0.1); // Responsive font size

  items.forEach((item, index) => {
    const startAngle = index * segmentAngle;
    const endAngle = (index + 1) * segmentAngle;

    const segment = new PIXI.Graphics();
    segment.beginFill(PIXI.utils.string2hex(item.color));
    segment.lineStyle(5, 0xcccccc);
    segment.moveTo(0, 0);
    segment.arc(0, 0, radius, startAngle, endAngle);
    segment.lineTo(0, 0);
    segment.endFill();

    const stopper = new PIXI.Graphics();
    stopper.beginFill(0x333333);
    stopper.lineStyle(7, 0xffffff);
    stopper.moveTo(0, 0);
    stopper.lineTo(
      Math.cos(startAngle) * radius,
      Math.sin(startAngle) * radius
    );
    stopper.lineTo(
      Math.cos(startAngle) * (radius + 10),
      Math.sin(startAngle) * (radius + 10)
    );
    stopper.lineTo(0, 0);
    stopper.endFill();

    wheelContainer.addChild(segment);
    wheelContainer.addChild(stopper);

    const labelAngle = startAngle + segmentAngle / 2;
    const labelX = Math.cos(labelAngle) * (radius * 0.7);
    const labelY = Math.sin(labelAngle) * (radius * 0.7);

    const text = new PIXI.Text(item.name.replace("+", "\n"), {
      fontFamily: "Thaoma",
      fontSize: fontSize,
      fontWeight: "regular",
      fill: 0xffffff,
      align: "right",
      dropShadow: true,
      dropShadowColor: 0x000000,
      dropShadowDistance: 1,
    });

    text.anchor.set(0.5);
    text.position.set(labelX, labelY);
    text.rotation = labelAngle + Math.PI;
    wheelContainer.addChild(text);
  });

  const centerCircle = new PIXI.Graphics();
  centerCircle.beginFill(0x222222);
  centerCircle.lineStyle(3, 0xffffff);
  centerCircle.drawCircle(0, 0, radius * 0.15);
  centerCircle.endFill();
  wheelContainer.addChild(centerCircle);
}

function createPointer() {
  const pointer = new PIXI.Graphics();
  pointer.beginFill(0xcccccc);
  pointer.moveTo(-radius * 0.1, 0);
  pointer.lineTo(radius * 0.11, 0);
  pointer.lineTo(0, -radius * 0.08);
  pointer.lineTo(-radius * 0.1, 0);
  pointer.endFill();

  pointer.beginFill(0x888888);
  pointer.endFill();

  pointer.position.set(centerX, centerY - radius - radius * 0.1);
  pointer.rotation = Math.PI;
  app.stage.addChild(pointer);

  gsap.to(pointer, {
    y: centerY - radius - radius * 0.08,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

function createConfetti(color, x, y) {
  const confetti = new PIXI.Graphics();
  const size = 1 + Math.random() * 6;
  const shape = Math.random() > 0.5 ? "circle" : "rect";

  if (shape === "circle") {
    confetti.beginFill(color);
    confetti.drawCircle(0, 0, size / 2);
    confetti.endFill();
  } else {
    confetti.beginFill(color);
    confetti.drawRect(-size / 2, -size / 2, size, size);
    confetti.endFill();
  }

  confetti.x = x;
  confetti.y = y;
  confetti.rotation = Math.random() * Math.PI * 2;
  app.stage.addChild(confetti);

  return confetti;
}

function showWinnerPopup() {
  const popup = document.getElementById("winner-popup");
  popup.innerHTML = "Ganaste\n " + items.find((i) => i.winner).name;
  popup.style.opacity = "1";
  popup.style.transform = "translate(-50%, -50%) scale(1)";

  setTimeout(() => {
    popup.style.opacity = "0";
    popup.style.transform = "translate(-50%, -50%) scale(0)";
  }, 5000);
}

async function spinWheel() {
  const isValid = await verifyToken();
  const spinButton = document.getElementById("spin-button");
  const resultDiv = document.getElementById("result");

  spinButton.disabled = true;
  resultDiv.textContent = "Spinning...";

  const spins = 9;
  const winnerIndex = items.findIndex((item) => item.winner);
  const segmentAngle = (2 * Math.PI) / items.length;
  const winnerCenterAngle = winnerIndex * segmentAngle + segmentAngle / 2;
  const pointerAngle = -Math.PI / 2;

  // Calculate exact rotation needed to align winner with pointer
  const targetRotation =
    spins * 2 * Math.PI + (pointerAngle - winnerCenterAngle);

  gsap.to(wheelContainer, {
    rotation: targetRotation,
    duration: 8,
    ease: "power3.out",
    onComplete: () => {
      spinButton.disabled = false;
      const selectedItem = items[winnerIndex];
      resultDiv.textContent = `Winner: ${selectedItem.name}`;
      resultDiv.style.color = selectedItem.color;

      const colors = [
        0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffa500,
        0xffffff,
      ];

      for (let i = 0; i < 9; i++) {
        setTimeout(() => {
          for (let j = 0; j < 70; j++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const confetti = createConfetti(
              color,
              centerX + (Math.random() - 0.5) * (radius * 1.2),
              centerY + (Math.random() - 0.5) * (radius * 1.2)
            );

            gsap.to(confetti, {
              x: confetti.x + (Math.random() - 0.5) * (radius * 1.4),
              y: confetti.y - 40 - Math.random() * (radius * 1),
              rotation: Math.random() * Math.PI * 8,
              alpha: 0,
              duration: 3 + Math.random(),
              onComplete: () => app.stage.removeChild(confetti),
            });
          }
        }, i * 200);
      }

      showWinnerPopup();
    },
  });
}

// Initialize the app and set up resize handler
window.addEventListener("load", () => {
  initApp();
  document.getElementById("spin-button").addEventListener("click", spinWheel);
});

window.addEventListener("resize", () => {
  initApp();
});
