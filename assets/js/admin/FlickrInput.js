import React, { Component, useState, useEffect } from "react";

const FlickrInput = props => {
  const [flickrId, setFlickrId] = useState(props.flickrId || "");
  const [photos, isFetching] = useFlickrAlbumFetch(flickrId);
  const onFlickrIdChange = e => {
    setFlickrId(e.target.value);
  };

  return (
    <div>
      <input
        className="w-full md:w-1/4 border px-3 py-2 rounded-sm bg-gray-100 focus:border-blue-500"
        onChange={onFlickrIdChange}
        value={flickrId}
        id="flickr_id"
        name="project[flickr_id]"
        type="text"
      />
      <div class="mt-4 col-3 md:col-9 col-gap-0">
        {photos.map(photo => (
          <div>
            <img
              key={photo.id}
              src={`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const useFlickrAlbumFetch = flickrId => {
  const [photos, setPhotos] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (flickrId.trim() !== "") {
      let isFresh = true;
      setIsFetching(true);
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `/admin/flickr_photos/${flickrId}`);
      xhr.repsonseType = "json";
      xhr.send();
      xhr.onload = () => {
        setIsFetching(false);
        if (xhr.status === 200) {
          setPhotos(JSON.parse(xhr.response));
        } else {
          setPhotos([]);
        }
      };
      return () => (isFresh = false);
    }
  }, [flickrId]);

  return [photos, isFetching];
};

export default FlickrInput;
