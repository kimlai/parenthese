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

export const markActiveLink = id => {
  const navbarItems = document.getElementsByClassName("navbar-item");
  for (var i = 0; i < navbarItems.length; i++) {
    if (navbarItems[i].children[0].id === id) {
      addClass(navbarItems[i], "active");
    } else {
      removeClass(navbarItems[i], "active");
    }
  }
  const topBarTitles = document.getElementsByClassName("topbar-title");
  for (var i = 0; i < topBarTitles.length; i++) {
    if (topBarTitles[i].id === `topbar-title-${id}`) {
      show(topBarTitles[i]);
    } else {
      hide(topBarTitles[i]);
    }
  }
};
