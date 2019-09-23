// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/map.css";
import mapboxgl from "mapbox-gl";
import { openNavbar, closeNavbar } from "./navbar";

document.getElementById("sidebar-open").addEventListener("click", openNavbar);
document.getElementById("sidebar-close").addEventListener("click", closeNavbar);

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2ltbGFpIiwiYSI6ImNpdHg4b3psMDAwMnAzd29hZ2VrbzVmeTcifQ.JEzjYNojtEPRBove3beibA";
const map = new mapboxgl.Map({
  container: "map-container",
  style: "mapbox://styles/mapbox/light-v10",
  center: [3, 38.5],
  zoom: 3
});

const projectToGeoJson = project => ({
  type: "Feature",
  geometry: {
    type: "point",
    coordinates: [
      project.location_coordinates.lng,
      project.location_coordinates.lat
    ]
  },
  properties: project
});

map.on("load", () => {
  map.addSource("projects", {
    type: "geojson",
    cluster: true,
    clusterRadius: 25,
    data: {
      type: "FeatureCollection",
      features: projects.map(projectToGeoJson)
    }
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "projects",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": "#51bbd6",
      "circle-radius": 25,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff"
    }
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "projects",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 18,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff"
    }
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "projects",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 16
    }
  });

  map.on("click", "clusters", function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
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

  map.on("click", "unclustered-point", function(e) {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const project = e.features[0].properties;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup({ closeButton: false, maxWidth: "280px" })
      .setLngLat(coordinates)
      .setHTML(
        `
        <div class="px-2 pt-2">
          <a href="/project/${project.id}">
            <h1 class="text-xl font-futura uppercase pb-3">${project.title}</h1>
            <p class="pb-3 text-sm">
              ${project.short_description}
            </p>
            <img src="${project.cover_url}/400x400.jpg" />
            <div class="text-gray-600 text-sm pt-2 pb-1">
              ${project.date}
            </div>
            <div class="text-gray-600 text-sm">
              ${project.location}
            </div>
          </a>
        </div>
        `
      )
      .addTo(map);
  });

  map.on("mouseenter", "clusters", function() {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", function() {
    map.getCanvas().style.cursor = "";
  });
  map.on("mouseenter", "unclustered-point", function() {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "unclustered-point", function() {
    map.getCanvas().style.cursor = "";
  });
});
