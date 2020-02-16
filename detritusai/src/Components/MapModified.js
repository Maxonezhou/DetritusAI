import React, { useState, Fragment } from "react";
import ReactDOM from "react-dom";
import NavBar from './NavBar';
import MapSolaceRecycle from './MapSolaceRecycle';
import MapSolaceTrash from './MapSolaceTrash';
import MapSolaceDirections from './MapSolaceDirections';

import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow
} from "@react-google-maps/api";

function MapModified() {
  // The things we need to track in state
  const [mapRef, setMapRef] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const [center, setCenter] = useState({ lat: 44.076613, lng: -98.362239833 });
  const [zoom, setZoom] = useState(5);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  // Load the Google maps scripts
  const { isLoaded } = useLoadScript({
    // Enter your own Google Maps API key
    googleMapsApiKey: "AIzaSyB0PKakIGKL9F4veyAeaD4mIXl28CDxJ-U"
  });

  // The places I want to create markers for.
  // This could be a data-driven prop.
  const myPlaces = [
  { id: "University of Toronto", pos: { lat: 43.662969, lng: -79.395764 }, contentRecycle: <MapSolaceRecycle />, contentTrash: <MapSolaceTrash />},
    { id: "Yonge-Dundas Square", pos: { lat: 43.656283, lng: -79.380214 }, contentRecycle: "70.153749", contentTrash: ":90.917473" },
    { id: "Waste Management - Etobicoke Transfer Station", pos: { lat: 43.607513, lng: -79.507833 }, directions: <MapSolaceDirections /> },
    { id: "Toronto City Hall", pos: { lat: 43.653649, lng:  -79.384004 }, contentRecycle: "0.45837", contentTrash: "10.173957"}
  ];

  // Iterate myPlaces to size, center, and zoom map to contain all markers
  const fitBounds = map => {
    const bounds = new window.google.maps.LatLngBounds();
    myPlaces.map(place => {
      bounds.extend(place.pos);
      return place.id;
    });
    map.fitBounds(bounds);
  };

  const loadHandler = map => {
    // Store a reference to the google map instance in state
    setMapRef(map);
    // Fit map bounds to contain all markers
    fitBounds(map);
  };

  // We have to create a mapping of our places to actual Marker objects
  const markerLoadHandler = (marker, place) => {
    return setMarkerMap(prevState => {
      return { ...prevState, [place.id]: marker };
    });
  };

  const markerClickHandler = (event, place) => {
    // Remember which place was clicked
    setSelectedPlace(place);

    // Required so clicking a 2nd marker works as expected
    if (infoOpen) {
      setInfoOpen(false);
    }

    setInfoOpen(true);

    // If you want to zoom in a little on marker click
    if (zoom < 13) {
      setZoom(13);
    }

    // if you want to center the selected Marker
    //setCenter(place.pos)
  };

  const renderMap = () => {
    return (
      <Fragment>

        <NavBar></NavBar>
        <GoogleMap
          // Do stuff on map initial laod
          onLoad={loadHandler}
          // Save the current center position in state
          //onCenterChanged={() => setCenter(mapRef.getCenter().toJSON())}
          // Save the user's map click position
          onClick={e => setClickedLatLng(e.latLng.toJSON())}
          center={center}
          zoom={zoom}
          mapContainerStyle={{
            height: "100vh",
            width: "100%"
          }}
        >
          {myPlaces.map(place => (
            <Marker
              key={place.id}
              position={place.pos}
              onLoad={marker => markerLoadHandler(marker, place)}
              onClick={event => markerClickHandler(event, place)}

            />
          ))}

          {infoOpen && selectedPlace && (
            <InfoWindow
              anchor={markerMap[selectedPlace.id]}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div>
                <h3>{selectedPlace.id}</h3>
                {selectedPlace.id !== "Waste Management - Etobicoke Transfer Station" && 
                  <div><th>Recycle: </th><th>{selectedPlace.contentRecycle}</th><th>%</th></div>
                }

                {selectedPlace.id !== "Waste Management - Etobicoke Transfer Station" && 
                  <div><th>Garbage: </th><th>{selectedPlace.contentTrash}</th><th>%</th></div>
                }
                {selectedPlace.id === "Waste Management - Etobicoke Transfer Station" && 
                  <div style={{whiteSpace: "pre-wrap"}}><th>Directions: </th><p>{selectedPlace.directions}</p></div>
                }
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Our center position always in state */}
        {/* <h3>
          Center {center.lat}, {center.lng}
        </h3> */}

        {/* Position of the user's map click */}
        {/* {clickedLatLng && (
          <h3>
            You clicked: {clickedLatLng.lat}, {clickedLatLng.lng}
          </h3>
        )} */}

        {/* Position of the user's map click */}
        {/* {selectedPlace && <h3>Selected Marker: {selectedPlace.id}</h3>} */}
      </Fragment>
    );
  };

  return isLoaded ? renderMap() : null;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<MapModified />, rootElement);

export default MapModified;
