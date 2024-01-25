import { Marker } from "@react-google-maps/api";
import { MarkerType } from "../../types/MarkerType";

interface Props {
  markers: MarkerType[];
  handleClickMarker: (marker: MarkerType) => void;
  handleDragMarker: (marker: MarkerType, event: google.maps.MapMouseEvent) => void;
}

export const MarkerList: React.FC<Props> = ({
  markers,
  handleClickMarker,
  handleDragMarker,
}) => {
  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          label={marker.label}
          draggable={true}
          onClick={() => handleClickMarker(marker)}
          onDragEnd={(event) => handleDragMarker(marker, event)}
        />
      ))}
    </>
  );
};
