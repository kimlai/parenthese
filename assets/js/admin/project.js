import React, { Fragment, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import {
  Editor,
  EditorState,
  RichUtils,
  ContentState,
  convertToRaw,
  convertFromRaw
} from "draft-js";
import "draft-js/dist/Draft.css";
import mapboxgl from "mapbox-gl";
import classnames from "classnames";
import PlaceInput from "./PlaceInput";
import FlickrInput from "./FlickrInput";

const Label = props => (
  <label
    className="mb-1 block text-sm text-gray-700 font-semibold pt-1"
    {...props}
  />
);

const Input = props => (
  <div>
    <input
      className={
        "w-full border px-3 py-2 rounded-sm bg-gray-100 focus:border-blue-500 " +
        (errors[props.id] && "border-red-700")
      }
      defaultValue={changes[props.id] || project[props.id]}
      {...props}
    />
  </div>
);

const Error = ({ children }) => (
  <div className="text-sm text-red-700 mb-3 px-3">{children}</div>
);

const statuses = {
  done: "Réalisé",
  doing: "En cours",
  rejected: "Non retenu",
  upcoming: "À venir"
};

const categories = {
  archi: "Archi",
  microArchi: "Micro-archi",
  scenography: "Scénographie",
  teaching: "Pédagogie"
};

const Select = ({ name, options, selected, select }) => (
  <Menu>
    <MenuButton
      className={
        "w-full border px-3 py-2 rounded-sm bg-gray-100 focus:border-blue-500 text-left " +
        (errors[name] && "border-red-700")
      }
    >
      {options[selected]}
      <span aria-hidden className="text-gray-500 float-right pr-2">
        ▾
      </span>
    </MenuButton>
    <MenuList className="border-gray-300 p-0">
      {Object.keys(options).map(option => (
        <MenuItem key={option} onSelect={() => select(option)}>
          {options[option]}
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
);

const Form = () => {
  const [youtubeSearchError, setYoutubeSearchError] = useState(null);
  const [youtubeInput, setYoutubeInput] = useState("");
  const [youtubeIds, setYoutubeIds] = useState(
    changes.youtube_ids || project.youtube_ids || []
  );
  const [vimeoSearchError, setVimeoSearchError] = useState(null);
  const [vimeoInput, setVimeoInput] = useState("");
  const [vimeoIds, setVimeoIds] = useState(
    changes.vimeo_ids || project.vimeo_ids || []
  );
  const [status, setStatus] = useState(changes.status || project.status);
  const [category, setCategory] = useState(
    changes.category || project.category
  );

  const youtubeLookup = e => {
    let youtubeId = null;
    try {
      youtubeId = new URLSearchParams(new URL(e.target.value).search).get("v");
    } catch (e) {}
    if (youtubeId) {
      setYoutubeInput("");
      setYoutubeIds(youtubeIds.concat([youtubeId]));
      setYoutubeSearchError(null);
    } else {
      setYoutubeInput(e.target.value);
      setYoutubeSearchError("URL Youtube non reconnue");
    }
  };
  const vimeoLookup = e => {
    let vimeoId = null;
    try {
      vimeoId = new URL(e.target.value).pathname.substring(1);
    } catch (e) {}
    if (vimeoId && /^\d+$/.test(vimeoId)) {
      setVimeoInput("");
      setVimeoIds(vimeoIds.concat([vimeoId]));
      setVimeoSearchError(null);
    } else {
      setVimeoInput(e.target.value);
      setVimeoSearchError("URL Vimeo non reconnue");
    }
  };

  const removeYoutubeId = id =>
    setYoutubeIds(youtubeIds.filter(yId => yId != id));

  const removeVimeoId = id => setVimeoIds(vimeoIds.filter(vId => vId != id));

  let editorRef = React.createRef();
  const focusEditor = () => editorRef.current.focus();
  let description = changes.description || project.description || "";
  let content;
  try {
    description = JSON.parse(description); // when the description has already been modified by draft-js
    content = convertFromRaw(description);
  } catch (err) {
    content = ContentState.createFromText(description); // when the description comes from a simple textarea
  }
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(content)
  );
  const onBoldClick = e => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  const mapRef = React.createRef();
  const [map, setMap] = useState();
  useEffect(
    () => initializeMap(mapRef.current, setMap, locationCoordinates),
    []
  );

  const [locationCoordinates, setLocationCoordinates] = useState(
    changes.location_coordinates || project.location_coordinates
  );
  const updateLocationCoordinatesInput = e => {
    const [lat, lng] = e.target.value.split(",").map(s => s.trim());
    updateLocationCoordinates({ lat, lng });
  };
  const updateLocationCoordinates = ({ lat, lng }) => {
    map.getSource("project").setData({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat]
      }
    });
    map.flyTo({
      center: [lng, lat]
    });
    setLocationCoordinates({ lat, lng });
  };

  return (
    <form
      acceptCharset="UTF-8"
      action={action}
      method="post"
      encType="multipart/form-data"
    >
      {method === "put" && <input type="hidden" name="_method" value="put" />}
      <input name="_csrf_token" type="hidden" value={window.csrfToken} />
      <Label htmlFor="title">Titre</Label>
      <div className="text-xl">
        <Input id="title" name="project[title]" type="text" />
      </div>
      <Error>{errors.title}</Error>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4">
          <Label htmlFor="date">Date de réalisation</Label>
          <Input id="date" name="project[date]" type="text" />
          <Error>{errors.date}</Error>

          <Label htmlFor="status">Status</Label>
          <input
            type="hidden"
            id="status"
            name="project[status]"
            value={status}
          />
          <Select
            name="status"
            options={statuses}
            selected={status}
            select={setStatus}
          />
          <Error>{errors.status}</Error>

          <Label htmlFor="category">Catégorie</Label>
          <input
            type="hidden"
            id="category"
            name="project[category]"
            value={category}
          />
          <Select
            name="category"
            options={categories}
            selected={category}
            select={setCategory}
          />
          <Error>{errors.category}</Error>

          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            name="project[client]"
            defaultValue={changes.client || project.client}
          />
          <Error>{errors.client}</Error>

          <Label htmlFor="client_website">Site internet</Label>
          <Input
            id="client_website"
            name="project[client_website]"
            defaultValue={changes.client_website || project.client_website}
          />
          <Error>{errors.client_website}</Error>

          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            name="project[budget]"
            defaultValue={changes.budget || project.budget}
          />
          <Error>{errors.budget}</Error>
        </div>

        <div className="w-full md:w-3/4 md:pl-12">
          <Label htmlFor="cover">Vignette</Label>
          <Input
            id="cover"
            name="project[cover]"
            type="file"
            accept="image/*"
          />
          <Error>{errors.cover_url}</Error>

          <Label htmlFor="very_short_description">
            Description très courte
          </Label>
          <Input
            id="very_short_description"
            name="project[very_short_description]"
            type="text"
          />
          <Error>{errors.very_short_description}</Error>

          <Label htmlFor="short_description">Description courte</Label>
          <Input
            id="short_description"
            name="project[short_description]"
            type="text"
          />
          <Error>{errors.short_description}</Error>

          <Label htmlFor="description">Description complète</Label>
          <input
            type="hidden"
            id="description"
            name="project[description]"
            value={JSON.stringify(
              convertToRaw(editorState.getCurrentContent())
            )}
          />
          <div>
            <button
              className={classnames("p-1 font-semibold", "text-gray-700", {
                "text-gray-900": editorState.getCurrentInlineStyle().has("BOLD")
              })}
              type="button"
              onMouseDown={onBoldClick}
            >
              B
            </button>
            <div
              style={{ minHeight: "380px" }}
              className={classnames(
                "border px-3 py-2 rounded-sm focus:border-blue-500 bg-gray-100",
                { "border-red-700": errors.description }
              )}
              onClick={focusEditor}
            >
              <Editor
                editorState={editorState}
                onChange={setEditorState}
                ref={editorRef}
              />
            </div>
          </div>
          <Error>{errors.description}</Error>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row">
        <div className="md:w-2/5">
          <Label htmlFor="location">
            Lieu{" "}
            <span className="font-normal text-gray-700 ml-2">
              affiché sur la carte d'identité du projet
            </span>
          </Label>
          <Input
            id="location"
            name="project[location]"
            location={changes.location || project.location}
          />
          <Error>{errors.location}</Error>

          <Label htmlFor="project[location_address]">
            Adresse exacte
            <span className="font-normal text-gray-700 ml-2">
              utilisée pour placer le projet sur la carte
            </span>
          </Label>
          <PlaceInput
            id="location_address"
            name="project[location_address]"
            address={changes.location_address || project.location_address}
            onSelect={updateLocationCoordinates}
          />
          <Error>{errors.location_address}</Error>

          <Label htmlFor="project[location_coordinates_string]">
            Coordonnées GPS (lat, lng)
          </Label>
          <Input
            id="location_coordinates_string"
            name="project[location_coordinates_string]"
            placeholder="( ... , ... )"
            value={
              locationCoordinates
                ? `${locationCoordinates.lat}, ${locationCoordinates.lng}`
                : ""
            }
            onChange={updateLocationCoordinatesInput}
          />
          <Error>{errors.location_coordinates}</Error>
        </div>
        <div
          style={{ height: "500px" }}
          className="md:w-3/5 md:p-6"
          id="map-container"
          ref={mapRef}
        ></div>
      </div>

      <div className="mt-8">
        <Label>Youtube</Label>
        <div className="w-full md:w-2/5">
          <div className="mb-3">
            <Input
              id="youtubeInput"
              placeholder="https://www.youtube.com/watch?v=w7YKws-dfIg"
              onChange={youtubeLookup}
              value={youtubeInput}
            />
            <Error>{youtubeInput && youtubeSearchError}</Error>
          </div>
          <div className="flex">
            {youtubeIds.map(id => (
              <div className="mb-3 mr-3" key={id}>
                <img key={id} src={`https://img.youtube.com/vi/${id}/1.jpg`} />
                <button
                  className="text-sm underline hover:text-red-600"
                  type="button"
                  onClick={() => removeYoutubeId(id)}
                >
                  Supprimer
                </button>
                <input
                  type="hidden"
                  id={id}
                  name="project[youtube_ids][]"
                  value={id}
                />
              </div>
            ))}
          </div>
          <div className="mb-3">
            <Label>Vimeo</Label>
            <Input
              placeholder="https://vimeo.com/54532104"
              onChange={vimeoLookup}
              value={vimeoInput}
            />
            <Error>{vimeoInput && vimeoSearchError}</Error>
          </div>
          <div className="flex">
            {vimeoIds.map(id => (
              <div className="mb-3 mr-3" key={id}>
                <iframe
                  src={"https://player.vimeo.com/video/" + id}
                  width="120"
                  height="70"
                  frameBorder="0"
                ></iframe>
                <button
                  className="text-sm underline hover:text-red-600"
                  type="button"
                  onClick={() => removeVimeoId(id)}
                >
                  Supprimer
                </button>
                <input
                  type="hidden"
                  id={id}
                  name="project[vimeo_ids][]"
                  value={id}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full mb-8">
          <Label htmlFor="flickr_id">Flickr id</Label>
          <FlickrInput
            flickrId={changes[changes.flickr_id] || project.flickr_id}
          />
          <Error>{errors.flickr_id}</Error>
        </div>
      </div>
      <a
        href="/admin"
        className=" uppercase text-teal-600 hover:text-teal-400 px-5 py-3 font-bold mr-4"
      >
        Annuler
      </a>
      <button
        className=" uppercase bg-teal-600 hover:bg-teal-400 rounded px-5 py-3 text-white font-bold"
        type="submit"
      >
        Valider
      </button>
    </form>
  );
};

const initializeMap = (ref, setMap, location) => {
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
    const geometry = location
      ? { type: "Point", coordinates: [location.lng, location.lat] }
      : null;
    map.addSource("project", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry
      }
    });

    map.addLayer({
      id: "markers",
      type: "symbol",
      source: "project",
      layout: {
        "icon-image": "marker-15",
        "icon-allow-overlap": true,
        "icon-anchor": "bottom"
      },
      paint: {
        "text-color": "#1A202C",
        "text-halo-color": "#F7FAFC",
        "text-halo-width": 1
      }
    });
    setMap(map);
  });
};

ReactDOM.render(<Form />, document.getElementById("react-root"));
