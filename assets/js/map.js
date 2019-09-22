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
  center: [3, 35.5],
  zoom: 2
});

projects.forEach(project => {
  const lngLat = [
    project.location_coordinates.lng,
    project.location_coordinates.lat
  ];
  new mapboxgl.Marker()
    .setLngLat(lngLat)
    .addTo(map)
    .setPopup(
      new mapboxgl.Popup({ closeButton: false, maxWidth: "320px" }).setHTML(`
        <div class="px-2 pt-2">
            <a href="/project/${project.id}">
              <h1 class="text-xl font-futura uppercase pb-3">${project.title}</h1>
              <p class="pb-3 text-sm">
                ${project.short_description}
              </p>
              <img width="300" height="300" src="${project.cover_url}/400x400.jpg" />
              <div class="text-gray-600 text-sm pt-3">
                ${project.date}
              </div>
            </a>
        </div>
        `)
    );
});
