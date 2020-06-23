import { show, hide, addClass, removeClass } from "./dom";

export const openNavbar = () => {
  hide(document.getElementById("sidebar-open"));
  hide(document.getElementById("topbar-titles"));
  show(document.getElementById("sidebar-close"));
  show(document.getElementById("navigation"));
};

export const closeNavbar = () => {
  show(document.getElementById("sidebar-open"));
  show(document.getElementById("topbar-titles"));
  hide(document.getElementById("sidebar-close"));
  hide(document.getElementById("navigation"));
};
