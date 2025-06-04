const prizes = {
  NIT: "https://script.google.com/macros/s/AKfycbyy82u_vrcfdR8HDmN40RwBm9zQXCRa168wc56RYRlz5ZZzs3NCIGB7_oCpWIG9PvAP/exec",
  NB: "https://script.google.com/macros/s/AKfycbwFywNB7a4Ik16nzfmfs6sGlmMAMgV3lV0fkyiX7v1dsyiobJ7fSJ7I71LkUx9L5u-nMA/exec",
  NAT: "https://script.google.com/macros/s/AKfycbw_62ILlvBuC1LkyumCFDzB-PRCGdZ5Ge9NPcc4-7Xy_iyIC_oDsXY8TZ_uqTHfOhNX/exec",
  NMG: "https://script.google.com/macros/s/AKfycbxrIoKozK6HyFjAP7mlnqU3-QNOcfdwNTjV4ymXNxJcFo-8RudLKOtBKfAUml7Hwfa6iA/exec",
};

const verifyToken = (type) => {
  const endpoint = prizes[type];
  return fetch(`${endpoint}?check=${token}`)
    .then((res) => res.text())
    .then((res) => res !== "YA_USADO" || type == "test2");
};

const getPrizes = (type) => {
  return fetch(
    "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhiBgfRkyl-RrTt_ifXrWMKL_h0cqX7ZucjNz7dtfhgmFezf2Zar-0muDMeC0-GDPFdJ06Fnsg-x2JReYCiBkIONj8XpQE0w64yAnIEbuEXI-yjytkz7ymhkFFr0CJK3WIHZn_AuZhBKuVu3SaDqGiyOTrKPpRYYYRWO4iNJ4Y_bCrMaKedUK9FLmBo5FrEKJz1bHPvoAbr6rSsCDvDRejMFv6DVNLe2fvIt1ipuwTe2Rip_4wh6IVhEzoDds4KpMTtXVuzXGLoqQUWWkPSZse6aPzdQqFhPi0zAaX2RRT5W58QMD4&lib=MGHH9vgcQXA-07THraBpOr9kh30YExdAc"
  )
    .then((response) => response.json())
    .then((obj) => obj.data.filter((row) => row.level == type))
    .catch((err) => console.log(err));
};

const savePrize = (premio, type, token) => {
  const endpoint = prizes[type];
  return fetch(
    `${endpoint}?token=${token}&premio=${encodeURIComponent(premio)}`
  )
    .then((res) => res.text())
    .then((data) => {
      if (data === "Token no encontrado.") throw Error(data);
      console.log("✅ Premio registrado: ", data);
    })
    .catch((err) => alert(err));
};
