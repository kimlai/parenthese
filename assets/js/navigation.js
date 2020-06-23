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
