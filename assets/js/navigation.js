import { addClass, removeClass, closestLink } from "./dom";
import { closeNavbar, markActiveLink } from "./navbar";

let xhr = new XMLHttpRequest();

const navigate = link => {
  removeClass(document.body, "content-loaded");
  addClass(document.body, "content-loading");
  addClass(document.body, "logo-loading");
  markActiveLink(link.id);
};

const startNavigation = () => {
  // looks like Firefox needs this to handle the "back" button correctly
  addClass(document.body, "content-loaded");
  removeClass(document.body, "content-loading");
  removeClass(document.body, "logo-loading");

  document.addEventListener("click", e => {
    const link = closestLink(e.target);
    if (!link || link.hasAttribute("data-ignore-navigation")) {
      return;
    }
    closeNavbar();
    navigate(link);
  });
};

export default startNavigation;
