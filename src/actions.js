export function clickOutside(node, cb) {
  function click(event) {
    if (event.composedPath().some((el) => el === node)) return;
    cb(event);
  }
  document.body.addEventListener("click", click);
  return {
    update(newCb) {
      cb = newCb;
    },
    destroy() {
      document.body.removeEventListener("click", click);
    },
  };
}
