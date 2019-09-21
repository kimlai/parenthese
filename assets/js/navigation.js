import { addClass, removeClass, closestLink } from "./dom";
import { closeNavbar } from "./navbar";

const navigate = url => {
  removeClass(document.body, "content-loaded");
  addClass(document.body, "content-loading");
  addClass(document.body, "logo-loading");

  let contentLoaded = false;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.repsonseType = "document";
  xhr.send();
  xhr.onload = () => {
    contentLoaded = true;
    const page = document.createElement("div");
    page.innerHTML = xhr.response;
    const content = page.querySelector("#content");
    document.getElementById("content").innerHTML = content.innerHTML;
    addClass(document.body, "content-loaded");
    removeClass(document.body, "content-loading");
    setTimeout(() => {
      removeClass(document.body, "logo-loading");
    }, 1200);
  };
  setTimeout(() => {
    if (contentLoaded === true) {
      removeClass(document.body, "logo-loading");
    }
  }, 1200);
};

const startNavigation = () => {
  document.addEventListener("click", e => {
    if (!window.history) {
      return;
    }
    const link = closestLink(e.target);
    if (!link) {
      return;
    }
    e.preventDefault();
    closeNavbar();

    history.pushState(null, null, link.getAttribute("href"));
    navigate(link.getAttribute("href"));
  });

  window.addEventListener("popstate", e => {
    navigate(document.location.pathname);
  });
};

export default startNavigation;
