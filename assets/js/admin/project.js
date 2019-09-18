import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import PlaceInput from "./PlaceInput";

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

  return (
    <form
      acceptCharset="UTF-8"
      action={action}
      method="post"
      encType="multipart/form-data"
    >
      {method === "put" && <input type="hidden" name="_method" value="put" />}
      <input name="_csrf_token" type="hidden" value={window.csrfToken} />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="project[title]" type="text" />
          <Error>{errors.title}</Error>

          <Label htmlFor="date">Date de réalisation</Label>
          <Input id="date" name="project[date]" type="text" />
          <Error>{errors.date}</Error>

          <Label htmlFor="location">Lieu</Label>
          <PlaceInput
            id="location"
            name="project[location]"
            location={changes.location || project.location}
          />
          <Error>{errors.location}</Error>

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

          <Label htmlFor="short_description">Description courte</Label>
          <Input
            id="short_description"
            name="project[short_description]"
            type="text"
          />
          <Error>{errors.short_description}</Error>

          <Label htmlFor="description">Description complète</Label>
          <textarea
            className={
              "w-full border px-3 py-2 rounded-sm bg-gray-100 focus:border-blue-500 " +
              (errors.description && "border-red-700")
            }
            rows="15"
            id="description"
            name="project[description]"
            type="textarea"
            defaultValue={changes.description || project.description}
          />
          <Error>{errors.description}</Error>
        </div>
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
        <div className="w-full md:w-1/4 mb-8">
          <Label htmlFor="flickr_id">Flickr id</Label>
          <Input id="flickr_id" name="project[flickr_id]" type="text" />
          <Error>{errors.flickr_id}</Error>
        </div>
      </div>
      <a
        href="/projects"
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

ReactDOM.render(<Form />, document.getElementById("react-root"));
