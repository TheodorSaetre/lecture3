import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

// Styling of OpenLayers components like zoom and pan controls
import "ol/ol.css";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Stroke, Style, Text } from "ol/style";

// By calling the "useGeographic" function in OpenLayers, we tell that we want coordinates to be in degrees
//  instead of meters, which is the default. Without this `center: [10.6, 59.9]` brings us to "null island"
useGeographic();

let municipalityLayer = new VectorLayer({
  source: new VectorSource({
    url: "/lecture3/geojson/fylker.json",
    format: new GeoJSON(),
  }),
  style: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1,
    }),
  }),
});

let schoolLayer = new VectorLayer({
  source: new VectorSource({
    url: "/lecture3/geojson/skoler.json",
    format: new GeoJSON(),
  }),
  style: (f) =>
    new Style({
      image: new Circle({
        radius: 20,
        stroke: new Stroke({
          color: "blue",
          width: 2,
        }),
      }),
      text: new Text({ text: f.getProperties().navn }),
    }),
});
// Here we create a Map object. Make sure you `import { Map } from "ol"`. Otherwise, the standard Javascript
//  map data structure will be used
const map = new Map({
  // The map will be centered on a position in longitude (x-coordinate, east) and latitude (y-coordinate, north),
  //   with a certain zoom level
  view: new View({ center: [10.7917, 59.9005], zoom: 9 }),
  // map tile images will be from the Open Street Map (OSM) tile layer
  layers: [
    new TileLayer({ source: new OSM() }),
    municipalityLayer,
    schoolLayer,
  ],
});

// A functional React component
export function Application() {
  // `useRef` bridges the gap between JavaScript functions that expect DOM objects and React components
  const mapRef = useRef<HTMLDivElement | null>(null);
  // When we display the page, we want the OpenLayers map object to target the DOM object refererred to by the
  // map React component
  useEffect(() => {
    map.setTarget(mapRef.current!);
  }, []);

  // This is the location (in React) where we want the map to be displayed
  return <div ref={mapRef}></div>;
}
