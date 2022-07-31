import { derived, writable } from "svelte/store";

export const url = createUrlStore();

export function createUrlStore(ssrUrl) {
  if (typeof window === "undefined") {
    const { subscribe } = writable(ssrUrl);
    return { subscribe };
  }

  const href = writable(window.location.href);
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  const updateHref = () => href.set(window.location.href);

  history.pushState = function () {
    originalPushState.apply(this, arguments);
    updateHref();
  };
  history.replaceState = function () {
    originalReplaceState.apply(this, arguments);
    updateHref();
  };

  window.addEventListener("popstate", updateHref);
  window.addEventListener("hashchange", updateHref);

  return {
    subscribe: derived(href, ($href) => new URL($href)).subscribe,
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
