const prizes = {
  NIT: "https://script.google.com/macros/s/AKfycbyy82u_vrcfdR8HDmN40RwBm9zQXCRa168wc56RYRlz5ZZzs3NCIGB7_oCpWIG9PvAP/exec",
};

const verifyToken = () => {
  const endpoint =
    "https://script.google.com/macros/s/AKfycbwdUXgKYdj2M6qBU12dd3f2hslZsekVZFmhfcnb584LbCPIdl3BlF5ILjjwOQz3njf_/exec";
  return fetch(`${endpoint}?check=${token}`)
    .then((res) => res.text())
    .then((res) => res === "YA_USADO");
};

const getPrizes = (type) => {
  return fetch(
    "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhiBgfRkyl-RrTt_ifXrWMKL_h0cqX7ZucjNz7dtfhgmFezf2Zar-0muDMeC0-GDPFdJ06Fnsg-x2JReYCiBkIONj8XpQE0w64yAnIEbuEXI-yjytkz7ymhkFFr0CJK3WIHZn_AuZhBKuVu3SaDqGiyOTrKPpRYYYRWO4iNJ4Y_bCrMaKedUK9FLmBo5FrEKJz1bHPvoAbr6rSsCDvDRejMFv6DVNLe2fvIt1ipuwTe2Rip_4wh6IVhEzoDds4KpMTtXVuzXGLoqQUWWkPSZse6aPzdQqFhPi0zAaX2RRT5W58QMD4&lib=MGHH9vgcQXA-07THraBpOr9kh30YExdAc"
  )
    .then((response) => response.json())
    .then((obj) => obj.data.filter((row) => row.level == type))
    .catch((err) => console.log(err));
};

const savePrize = (type) => {
  return fetch("");
};
