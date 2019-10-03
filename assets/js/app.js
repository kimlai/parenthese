// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import Micromodal from "micromodal";
import css from "../css/app.css";
import { hasAttribute, idEq, onClickWhen, onClickWhenAncestor } from "./dom";
import startNavigation from "./navigation";
import { openNavbar, closeNavbar } from "./navbar";
import { filterProjects } from "./project-list";
import { seeMore, seeLess } from "./project";

document.getElementById("sidebar-open").addEventListener("click", openNavbar);
document.getElementById("sidebar-close").addEventListener("click", closeNavbar);
onClickWhen(idEq("more"), seeMore);
onClickWhen(idEq("less"), seeLess);
onClickWhen(hasAttribute("data-category"), filterProjects);
onClickWhenAncestor(hasAttribute("data-micromodal-trigger"), ancestor => {
  Micromodal.show(ancestor.getAttribute("data-micromodal-trigger"), {
    // those two callbacks stop video iframes from playing in the background when
    // the modal is closed. I don't want to deal with youtube and vimeo javascript libs.
    onShow: modal => {
      modal.originalInnerHTML = modal.innerHTML;
    },
    onClose: modal => {
      modal.innerHTML = modal.originalInnerHTML;
    }
  });
});

startNavigation();
