export function debounce(fn, ms) {
  let isCooldown = false;
  return function () {
    if (isCooldown) return;
    fn.apply(this, arguments);
    isCooldown = true;
    setTimeout(() => (isCooldown = false), ms);
  };
}

function normalizePrice(res) {
  try {
    let value = res.market_data.current_price.usd;
    if (value >= 1) return +value.toFixed(2);
    let counter = 0;
    while (value < 1) {
      value = 10 * value;
      counter++;
    }
    return Math.trunc(100 * value) / 10 ** (counter + 2);
  } catch (err) {
    return "N/A";
  }
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
    .then((res) => normalizePrice(res))
    .catch(() => "Failed to fetch");
}

export function renderValue(value, type) {
  if (Number.isNaN(value)) {
    return `N/A`;
  }
  let toSmall = 0 < value && value < 0.01 ? "<span>&lt;0.01</span>" : "";
  let strong = toSmall || value.toFixed(2);
  if (type === "%") {
    return `<strong>${strong}</strong>&nbsp;<span>%</span>`;
  }
  if (type === "$") {
    return `<span>$</span>&nbsp;<strong>${strong}</strong>`;
  }
  toSmall = 0 < value && value < 0.1 ? "<span>&lt;0.1</span>" : "";
  strong = toSmall || value.toFixed(1);
  if (type === "days") {
    return `<strong>${strong}</strong>&nbsp;<span>days</span>`;
  }
  return ``;
}
