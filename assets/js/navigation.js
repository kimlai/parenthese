import { addClass, removeClass, closestLink } from "./dom";
import { closeNavbar, markActiveLink } from "./navbar";

let xhr = new XMLHttpRequest();

const navigate = link => {
  removeClass(document.body, "content-loaded");
  addClass(document.body, "content-loading");
  addClass(document.body, "logo-loading");

  markActiveLink(link.id);

  let contentLoaded = false;

  xhr.abort(); // in case a previous navigation request was sent
  xhr = new XMLHttpRequest();
  xhr.open("GET", link.href);
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
    if (e.target.hasAttribute("data-ignore-navigation")) {
      return;
    }
    const link = closestLink(e.target);
    if (!link) {
      return;
    }
    e.preventDefault();
    closeNavbar();

    history.pushState(
      { activeLinkId: link.id },
      null,
      link.getAttribute("href")
    );
    navigate(link);
  });

  window.addEventListener("popstate", e => {
    navigate({
      href: document.location.pathname,
      id: e.state && e.state.activeLinkId
    });
  });
};

export default startNavigation;
