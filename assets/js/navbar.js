import { show, hide } from "./dom";

export const openNavbar = () => {
  hide(document.getElementById("sidebar-open"));
  show(document.getElementById("sidebar-close"));
  show(document.getElementById("navigation"));
};

export const closeNavbar = () => {
  show(document.getElementById("sidebar-open"));
  hide(document.getElementById("sidebar-close"));
  hide(document.getElementById("navigation"));
};
