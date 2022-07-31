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
