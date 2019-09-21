import { show, hide, addClass, removeClass } from "./dom";

export const seeMore = e => {
  hide(e.target);
  show(document.getElementById("less"));
  const description = document.getElementById("description");
  removeClass(description, "overflow-y-hidden");
  removeClass(description, "h-24");
};

export const seeLess = e => {
  hide(e.target);
  show(document.getElementById("more"));
  const description = document.getElementById("description");
  addClass(description, "overflow-y-hidden");
  addClass(description, "h-24");
  description.scrollIntoView({ block: "nearest" });
};
