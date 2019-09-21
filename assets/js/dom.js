export const closestLink = el => {
  if (el === null || el.tagName === "A") {
    return el;
  }
  return closestLink(el.parentElement);
};

export const addClass = (el, classname) => el.classList.add(classname);
export const removeClass = (el, classname) => el.classList.remove(classname);

export const hide = el => addClass(el, "hidden");
export const show = el => removeClass(el, "hidden");

export const hasAttribute = attr => el => el.hasAttribute(attr);
export const idEq = id => el => el.id === id;

export const onClickWhen = (pred, fn) => {
  document.addEventListener("click", e => {
    if (!pred(e.target)) {
      return;
    }
    fn(e);
  });
};
