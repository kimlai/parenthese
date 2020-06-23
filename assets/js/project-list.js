import { show, hide, addClass, removeClass } from "./dom";

const markActiveFilter = e => {
  const filters = document.getElementsByClassName("category-filter");
  for (var i = 0; i < filters.length; i++) {
    removeClass(filters[i], "active");
  }
  addClass(e.target, "active");
};

export const filterProjects = e => {
  e.preventDefault();
  const category = e.target.getAttribute("data-category");
  const list = document.getElementById("project-list");
  const projects = document.getElementsByClassName("project");
  for (var i = 0; i < projects.length; i++) {
    var project = projects[i];
    if (
      category === "all" ||
      project.getAttribute("data-project-category") === category
    ) {
      show(project);
    } else {
      hide(project);
    }
  }
  markActiveFilter(e);
};
