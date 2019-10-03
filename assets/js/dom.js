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

const findAncestor = (predicate, el) => {
  if (predicate(el)) {
    return el;
  }
  if (!el.parentElement) {
    return null;
  }
  return findAncestor(predicate, el.parentElement);
};
export const onClickWhenAncestor = (pred, fn) => {
  document.addEventListener("click", e => {
    const el = findAncestor(pred, e.target);
    if (!el) {
      return;
    }
    fn(el);
  });
};

export const onClickWhen = (pred, fn) => {
  document.addEventListener("click", e => {
    if (!pred(e.target)) {
      return;
    }
    fn(e);
  });
};
