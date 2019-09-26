// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/map.css";
import React, { Fragment, useEffect } from "react";
import ReactDOM from "react-dom";
import { Router, Link } from "@reach/router";
import mapboxgl from "mapbox-gl";
import { openNavbar, closeNavbar } from "./navbar";
import { removeClass, addClass } from "./dom";

document.getElementById("sidebar-open").addEventListener("click", openNavbar);
document.getElementById("sidebar-close").addEventListener("click", closeNavbar);

const ProjectList = ({ projects }) => (
  <Fragment>
    {projects.map(project => (
      <div className="project p-6 w-full hover:bg-gray-300" key={project.id}>
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
  </Fragment>
);

const SelectedProject = ({ projectId }) => {
  const project = projects.filter(p => p.id === parseInt(projectId, 10))[0];

  return (
    <div className="px-6">
      <div className="pt-6 font-semibold text-2xl uppercase font-futura tracking-wide">
        {project.title}
      </div>
      <div className="text-gray-700 py-4">{project.short_description}</div>
      <div>
        <img src={`${project.cover_url}/400x400.jpg`} />
      </div>
      <div className="text-gray-700 py-4 text-gray-700">
        {project.description}
      </div>
      <div className="bottom-0 fixed w-full bg-gray-100 pb-10 pt-6">
        <Link
          to="/map"
          className=" uppercase text-orange-500 hover:text-orange-400 pr-4 font-bold"
        >
          Retour
        </Link>
        <a
          href={`/project/${project.id}`}
          className=" uppercase bg-orange-500 hover:bg-orange-400 rounded px-4 py-3 text-white font-bold"
        >
          Voir
        </a>
      </div>
    </div>
  );
};

const Map = ({ children, navigate }) => {
  const mapRef = React.createRef();
  useEffect(
    () => initializeMap(mapRef.current, id => navigate(`/map/project/${id}`)),
    []
  );

  return (
    <Fragment>
      <div id="map-container" ref={mapRef}></div>
      <div className="hidden md:block fixed top-0 bottom-0 right-0 pt-16 bg-gray-100 border-gray-500 border-l w-1/4 overflow-y-scroll">
        {children}
      </div>
    </Fragment>
  );
};

const Page = () => (
  <Router basepath="/map">
    <Map path="/">
      <ProjectList projects={projects} path="/" />
      <SelectedProject path="/project/:projectId" />
    </Map>
  </Router>
);

const initializeMap = (ref, navigateToProject) => {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia2ltbGFpIiwiYSI6ImNpdHg4b3psMDAwMnAzd29hZ2VrbzVmeTcifQ.JEzjYNojtEPRBove3beibA";
  const map = new mapboxgl.Map({
    container: ref,
    style: "mapbox://styles/kimlai/ck10dlbaq01r31clv9t573kit",
    center: [3, 38.5],
    zoom: 3
  });

  const projectToGeoJson = project => ({
    type: "Feature",
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

  map.on("load", () => {
    map.addSource("projects", {
      type: "geojson",
      cluster: true,
      clusterRadius: 20,
      data: {
        type: "FeatureCollection",
        features: projects.map(projectToGeoJson)
      }
    });
    map.addSource("selected-project", {
      type: "geojson",
      data: { type: "Feature" }
    });

    //    map.addLayer({
    //      id: "clusters",
    //      type: "circle",
    //      source: "projects",
    //      filter: ["has", "point_count"],
    //      paint: {
    //        "circle-color": "#51bbd6",
    //        "circle-radius": 20,
    //        "circle-stroke-width": 1,
    //        "circle-stroke-color": "#fff"
    //      }
    //    });

    //    map.addLayer({
    //      id: "cluster-count",
    //      type: "symbol",
    //      source: "projects",
    //      filter: ["has", "point_count"],
    //      layout: {
    //        "text-field": "{point_count_abbreviated}",
    //        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    //        "text-size": 16
    //      }
    //    });

    //    map.addLayer({
    //      id: "selected-project",
    //      type: "circle",
    //      source: "selected-project",
    //      paint: {
    //        "circle-color": "#ED8936",
    //        "circle-radius": 18,
    //        "circle-stroke-width": 1,
    //        "circle-stroke-color": "#fff"
    //      }
    //    });

    map.addLayer({
      id: "unclustered-point",
      type: "symbol",
      source: "projects",
      //      filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": "parenthese-logo",
        "icon-allow-overlap": true,
        "symbol-avoid-edges": true,
        "text-field": [
          "format",
          ["get", "title"],
          { "font-scale": 1.2 },
          "\n",
          {},
          ["get", "short_description"],
          { "font-scale": 0.7 }
        ],
        "text-variable-anchor": ["left", "right", "bottom"],
        "text-radial-offset": 1,
        "text-justify": "left"
      },
      paint: {
        "text-halo-color": "#F7FAFC",
        "text-halo-width": 1
      }
    });

    map.on("click", "clusters", function(e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"]
      });
      var clusterId = features[0].properties.cluster_id;
      map
        .getSource("projects")
        .getClusterExpansionZoom(clusterId, function(err, zoom) {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
          });
        });
    });

    const onProjectClick = e => {
      const project = e.features[0];

      map.getSource("selected-project").setData({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: project.geometry.coordinates.slice()
        },
        properties: project.properties
      });

      navigateToProject(project.properties.id);
    };

    map.on("click", "unclustered-point", onProjectClick);
    map.on("click", "unclustered-point-label", onProjectClick);

    map.on("mouseleave", "clusters", function() {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseleave", "unclustered-point", function() {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseleave", "unclustered-point-label", function() {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", "clusters", function() {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseenter", "unclustered-point", function() {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseenter", "unclustered-point-label", function() {
      map.getCanvas().style.cursor = "pointer";
    });
  });
};

ReactDOM.render(<Page />, document.getElementById("react-root"));
