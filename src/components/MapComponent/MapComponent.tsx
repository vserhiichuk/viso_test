import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { db } from "../../firebase";
import {
  DEFAULT_VALUE_COORDINATES,
  DEFAULT_VALUE_ZOOM_MAP,
  INITIAL_CENTER,
  LABELS,
  MAP_CONTAINER_STYLE,
} from "../../utils/_variables";
import { MarkerType } from "../../types/MarkerType";
import { updateFirebaseData } from "../../firebaseUtils";
import { MarkerList } from "../MarkerList";
import { MarkerPopup } from "../MarkerPopup";

let LABEL_INDEX = 0;

export const MapComponent: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);

  useEffect(() => {
    const updateFirebase = async () => {
      await updateFirebaseData(markers);
    };

    updateFirebase().then((result) => console.log(result));
  }, [markers]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const newMarker = {
      id: uuidv4(),
      lat: event.latLng?.lat() || DEFAULT_VALUE_COORDINATES,
      lng: event.latLng?.lng() || DEFAULT_VALUE_COORDINATES,
      label: LABELS[LABEL_INDEX++ % LABELS.length],
    };

    setMarkers((prevState) => [...prevState, newMarker]);
  };

  const handleMarkerClick = (marker: MarkerType) => {
    setSelectedMarker(marker);
  };

  const handleMarkerDrag = (
    marker: MarkerType,
    event: google.maps.MapMouseEvent
  ) => {
    setMarkers((prevState) =>
      prevState.map((prevMarker) => {
        if (prevMarker.id === marker.id) {
          return {
            ...prevMarker,
            lat: event.latLng?.lat() || DEFAULT_VALUE_COORDINATES,
            lng: event.latLng?.lng() || DEFAULT_VALUE_COORDINATES,
          };
        }
        return prevMarker;
      })
    );
  };

  const handleDeleteMarker = () => {
    setMarkers((prevState) =>
      prevState.filter((prevMarker) => prevMarker.id !== selectedMarker?.id)
    );
    setSelectedMarker(null);
  };

  const handleDeleteAllMarkers = async () => {
    const questCollectionRef = collection(db, "markers");
    const snapshot = await getDocs(questCollectionRef);

    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    setMarkers([]);
    setSelectedMarker(null);
  };

  return (
    <LoadScript
      googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
    >
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={INITIAL_CENTER}
        zoom={DEFAULT_VALUE_ZOOM_MAP}
        onClick={handleMapClick}
      >
        <MarkerList
          markers={markers}
          handleMarkerClick={handleMarkerClick}
          handleMarkerDrag={handleMarkerDrag}
        />

        {selectedMarker && (
          <MarkerPopup
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            handleDeleteMarker={handleDeleteMarker}
          />
        )}
      </GoogleMap>

      {!!markers.length && (
        <button
          onClick={() => handleDeleteAllMarkers()}
          style={{
            position: "absolute",
            top: "10px",
            left: "205px",
          }}
        >
          Delete All markers
        </button>
      )}
    </LoadScript>
  );
};
