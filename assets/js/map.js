// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/map.css";
import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Router, Link, navigate } from "@reach/router";
import mapboxgl from "mapbox-gl";
import RichText from "./rich-text.js";
import { openNavbar, closeNavbar } from "./navbar";
import { removeClass, addClass } from "./dom";
import { partition } from "./list";

document.getElementById("sidebar-open").addEventListener("click", openNavbar);
document.getElementById("sidebar-close").addEventListener("click", closeNavbar);

const projectToGeoJson = project => ({
  type: "Feature",
  id: project.id, // needed to use "feature-state"
  geometry: {
    type: "Point",
    coordinates: [
      project.location_coordinates.lng,
      project.location_coordinates.lat
    ]
  },
  properties: {
    id: project.id,
    title: project.title,
    short_description: project.short_description.slice(0, 60) + "..."
  }
});

const highlightProject = (map, projectId) => {
  const [[selectedProject], otherProjects] = partition(
    p => p.id === projectId,
    projects
  );
  map.getSource("projects").setData({
    type: "FeatureCollection",
    features: otherProjects.map(projectToGeoJson)
  });
  map
    .getSource("highlighted-project")
    .setData(projectToGeoJson(selectedProject));
};

const removeHighlighting = map => {
  map.getSource("projects").setData({
    type: "FeatureCollection",
    features: projects.map(projectToGeoJson)
  });
  map.getSource("highlighted-project").setData({ type: "Feature" });
};

const ProjectList = ({ projects, map }) => (
  <div className="hidden md:block fixed top-0 bottom-0 right-0 pt-48 bg-gray-100 border-gray-500 border-l w-1/4 overflow-y-scroll">
    {projects.map(project => (
      <div
        className="project p-6 w-full hover:bg-gray-300"
        key={project.id}
        onMouseEnter={map ? () => highlightProject(map, project.id) : null}
        onMouseLeave={map ? () => removeHighlighting(map) : null}
      >
        <Link to={`/map/project/${project.id}`}>
          <div className="flex">
            <div className="flex-none w-20 mr-4">
              <img src={`${project.cover_url}/400x400.jpg`} />
            </div>
            <div>
              <div className="font-semibold">{project.title}</div>
              <div className="text-gray-700">{project.short_description}</div>
            </div>
          </div>
        </Link>
      </div>
    ))}
  </div>
);

const SelectedProject = ({ projectId, map }) => {
  const id = parseInt(projectId, 10);
  const [[project], otherProjects] = partition(p => p.id === id, projects);

  if (map) {
    highlightProject(map, id);
    map.flyTo({
      center: [
        project.location_coordinates.lng,
        project.location_coordinates.lat
      ]
    });
  }

  return (
    <div className="fixed top-0 bottom-0 right-0 pt-16 md:pt-48 bg-gray-100 border-gray-500 md:border-l w-full md:w-1/4 overflow-y-hidden z-30 md:z-0">
      <div className="px-6 pb-20">
        <div className="pt-6 font-medium text-2xl uppercase tracking-wide">
          {project.title}
        </div>
        <div className="text-gray-700 text-lg py-4">
          {project.short_description}
        </div>
        <div>
          <img src={`${project.cover_url}/400x400.jpg`} />
        </div>
        <div className="text-gray-700 py-4 text-gray-700">
          <RichText richText={project.description} />
        </div>
        <div className="bottom-0 fixed w-full bg-gray-100 pb-10 pt-6">
          <Link
            to="/map"
            className=" uppercase text-orange-500 hover:text-orange-400 pr-4 font-bold"
          >
            Retour
          </Link>
          <a
            href={`/project/show/${project.id}`}
            className=" uppercase bg-orange-500 hover:bg-orange-400 rounded ml-4 px-4 py-3 text-white font-bold"
          >
            Voir
          </a>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const mapRef = React.createRef();
  const [map, setMap] = useState();
  useEffect(
    () =>
      initializeMap(
        mapRef.current,
        id => navigate(`/map/project/${id}`),
        setMap
      ),
    []
  );
  return (
    <Fragment>
      <div className="md:w-3/4" id="map-container" ref={mapRef}></div>
      <Router basepath="/map">
        <ProjectList projects={projects} path="/" map={map} />
        <SelectedProject path="/project/:projectId" map={map} />
      </Router>
    </Fragment>
  );
};

const initializeMap = (ref, navigateToProject, setMap) => {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia2ltbGFpIiwiYSI6ImNpdHg4b3psMDAwMnAzd29hZ2VrbzVmeTcifQ.JEzjYNojtEPRBove3beibA";
  const map = new mapboxgl.Map({
    container: ref,
    style: "mapbox://styles/kimlai/ck11ws8pt0lqz1cqgu2ufbfhp",
    center: [3, 45.5],
    zoom: 5,
    fadeDuration: 80
  });

  map.on("load", () => {
    map.addSource("projects", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: projects.map(projectToGeoJson)
      }
    });
    map.addSource("highlighted-project", {
      type: "geojson",
      data: { type: "Feature" }
    });

    map.addLayer({
      id: "highlighted-marker",
      type: "symbol",
      source: "highlighted-project",
      layout: {
        "icon-image": "marker-15-orange",
        "icon-allow-overlap": true,
        "icon-anchor": "bottom",
        "text-field": ["format", ["get", "title"], { "font-scale": 1 }],
        "text-variable-anchor": ["left", "right", "top"],
        "text-radial-offset": 0.5
      },
      paint: {
        "text-color": "#ED8936",
        "text-halo-color": "#FFFAF0",
        "text-halo-width": 1
      }
    });

    map.addLayer(
      {
        id: "markers",
        type: "symbol",
        source: "projects",
        layout: {
          "icon-image": "marker-15",
          "icon-allow-overlap": true,
          "icon-anchor": "bottom",
          "text-optional": true,
          "text-field": ["format", ["get", "title"], { "font-scale": 1 }],
          "text-variable-anchor": ["left", "right", "top"],
          "text-radial-offset": 0.5,
          "symbol-z-order": "source"
        },
        paint: {
          "text-color": "#1A202C",
          "text-halo-color": "#F7FAFC",
          "text-halo-width": 1
        }
      },
      "highlighted-marker"
    );

    map.on("click", "markers", e => {
      navigateToProject(e.features[0].properties.id);
    });

    map.on("mouseenter", "markers", function() {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "markers", function() {
      map.getCanvas().style.cursor = "";
    });

    setMap(map);
  });
};

ReactDOM.render(<Page />, document.getElementById("react-root"));
