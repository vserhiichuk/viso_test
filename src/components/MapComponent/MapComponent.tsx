import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  INITIAL_CENTER,
  INITIAL_VALUE_COORDINATES,
  LABELS,
  MAP_CONTAINER_STYLE,
} from "../../utils/_variables";
import { MarkerType } from "../../types/MarkerType";
import MarkerList from "../MarkerList/MarkerList";
import MarkerPopup from "../MarkerPopup/MarkerPopup";

let LABEL_INDEX = 0;

const MapComponent: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);

  useEffect(() => {
    const updateFirebaseData = async () => {
      const firebaseData = markers.map(({ lat, lng }) => ({
        Location: { Lat: lat, Long: lng },
        Timestamp: new Date(),
        Next: markers.length + 1,
      }));

      const questCollectionRef = collection(db, "markers");

      await Promise.all(
        firebaseData.map(async (data, index) => {
          await setDoc(doc(questCollectionRef, `Quest ${index + 1}`), data);
        })
      );
    };

    updateFirebaseData().then((result) => console.log(result));
  }, [markers]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const newMarker = {
      id: Date.now(),
      lat: event.latLng?.lat() || INITIAL_VALUE_COORDINATES,
      lng: event.latLng?.lng() || INITIAL_VALUE_COORDINATES,
      label: LABELS[LABEL_INDEX++ % LABELS.length],
    };

    setMarkers((prevState) => [...prevState, newMarker]);
  };

  const handleMarkerClick = (marker: MarkerType) => {
    setSelectedMarker(marker);
  };

  const handleMarkerDrag = (
    marker: MarkerType,
    e: google.maps.MapMouseEvent
  ) => {
    setMarkers((prevState) =>
      prevState.map((prevMarker) => {
        if (prevMarker.id === marker.id) {
          return {
            ...prevMarker,
            lat: e.latLng?.lat() || INITIAL_VALUE_COORDINATES,
            lng: e.latLng?.lng() || INITIAL_VALUE_COORDINATES,
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
        zoom={8}
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

export default MapComponent;
