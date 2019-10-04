import React, { Component, useState, useEffect } from "react";
import algoliasearch from "algoliasearch";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { path } from "../object";

const places = algoliasearch.initPlaces(
  "plB2AM11RFMX",
  "56bec93e5943c316e06f76fe6fb06f0c"
);

const formatResult = result => {
  return [
    path(result, ["locale_names", 0]),
    path(result, ["city"]),
    path(result, ["postcode", 0]),
    path(result, ["country"])
  ]
    .filter(part => part !== null)
    .join(", ");
};

const PlaceInput = ({ onSelect }) => {
  const [coordinates, setCoordinates] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, isFetching] = useAddressSearch(searchTerm);
  const onSearchTermChange = e => {
    setSearchTerm(e.target.value);
  };
  const onSelected = selection => {
    //combobox is weird, so we have to search back what result was selected
    const selected = searchResults.filter(
      res => formatResult(res) === selection
    )[0];
    onSelect(selected._geoloc);
  };

  return (
    <Combobox onSelect={onSelected}>
      <div className="relative">
        {isFetching && (
          <div className="absolute top-0 right-0 p-2 text-gray-600">...</div>
        )}
        <ComboboxInput
          className="location-input w-full border px-3 py-2 rounded-sm bg-gray-100 focus:border-blue-500"
          onChange={onSearchTermChange}
        />
      </div>
      {searchResults.length > 0 && (
        <ComboboxPopover>
          <ComboboxList>
            {searchResults.map(result => {
              return (
                <ComboboxOption
                  key={result.objectID}
                  value={formatResult(result)}
                />
              );
            })}
          </ComboboxList>
        </ComboboxPopover>
      )}
    </Combobox>
  );
};

const useAddressSearch = searchTerm => {
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() !== "" && searchTerm.length > 3) {
      let isFresh = true;
      setIsFetching(true);
      places.search(
        { query: searchTerm, language: "FR", hitsPerPage: 5 },
        (err, res) => {
          if (err) {
            throw err;
          }
          if (isFresh) {
            setIsFetching(false);
            setResults(res.hits);
          }
        }
      );
      return () => (isFresh = false);
    }
  }, [searchTerm]);

  return [results, isFetching];
};

export default PlaceInput;
