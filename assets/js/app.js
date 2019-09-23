// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";
import { hasAttribute, idEq, onClickWhen } from "./dom";
import startNavigation from "./navigation";
import { openNavbar, closeNavbar } from "./navbar";
import { filterProjects } from "./project-list";
import { seeMore, seeLess } from "./project";

document.getElementById("sidebar-open").addEventListener("click", openNavbar);
document.getElementById("sidebar-close").addEventListener("click", closeNavbar);
onClickWhen(idEq("more"), seeMore);
onClickWhen(idEq("less"), seeLess);
onClickWhen(hasAttribute("data-category"), filterProjects);

startNavigation();
