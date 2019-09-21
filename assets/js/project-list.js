import { show, hide } from "./dom";

export const filterProjects = e => {
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
};
