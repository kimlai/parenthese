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

  // when navigating using the "back" and "forward" buttons in Firefox, javascript is not
  // re-executed, since the page is retreived from the "bf-cache". So to un-hide the content
  // we need to explicitly manipulate the DOM when the page is shown.
  window.addEventListener("pageshow", () => {
    addClass(document.body, "content-loaded");
    removeClass(document.body, "content-loading");
    removeClass(document.body, "logo-loading");
  });
};

export default startNavigation;
