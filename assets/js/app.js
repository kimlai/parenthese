// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html";

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"

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
