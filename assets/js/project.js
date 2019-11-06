import { show, hide, addClass, removeClass } from "./dom";

export const seeMore = e => {
  hide(e.target);
  show(document.getElementById("less"));
  const description = document.getElementById("description");
  addClass(description.parentElement.parentElement, "description-open");
};

export const seeLess = e => {
  hide(e.target);
  show(document.getElementById("more"));
  const description = document.getElementById("description");
  removeClass(description.parentElement.parentElement, "description-open");
  description.scrollIntoView({ block: "nearest" });
};
