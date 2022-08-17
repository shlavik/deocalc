export function debounce(f, ms) {
  let isCooldown = false;
  return function () {
    if (isCooldown) return;
    f.apply(this, arguments);
    isCooldown = true;
    setTimeout(() => (isCooldown = false), ms);
  };
}

export function renderValue(value, type) {
  if (Number.isNaN(value)) {
    return `N/A`;
  }
  let toSmall = 0 < value && value < 0.01 ? "<span>&lt;</span>" : "";
  if (type === "%") {
    return `<strong>${toSmall + value.toFixed(2)}</strong>&nbsp;<span>%</span>`;
  }
  if (type === "$") {
    return `<span>$</span>&nbsp;<strong>${toSmall + value.toFixed(2)}</strong>`;
  }
  toSmall = 0 < value && value < 0.1 ? "<span>&lt;</span>" : "";
  if (type === "days") {
    return `<strong>${toSmall + value.toFixed(1)}</strong> <span>days</span>`;
  }
  return ``;
}

function normalizePrice(value) {
  if (value >= 1) return value.toFixed(2);
  let counter = 0;
  while (value < 1) {
    value = 10 * value;
    counter++;
  }
  return Math.trunc(100 * value) / 10 ** (counter + 2);
}

export async function fetchPrice(coinId, dateIso) {
  if (!coinId || !dateIso) return;
  const [yy, mm, dd] = dateIso.split("-");
  return fetch(
    "https://api.coingecko.com/api/v3/coins/" +
      coinId +
      "/history?date=" +
      `${dd}-${mm}-${yy}`
  )
    .then((res) => res.json())
    .then((res) => normalizePrice(res.market_data.current_price.usd));
}
