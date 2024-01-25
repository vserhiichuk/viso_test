import { Marker } from "@react-google-maps/api";
import { MarkerType } from "../../types/MarkerType";

interface Props {
  markers: MarkerType[];
  handleMarkerClick: (marker: MarkerType) => void;
  handleMarkerDrag: (marker: MarkerType, event: google.maps.MapMouseEvent) => void;
}

const MarkerList: React.FC<Props> = ({
  markers,
  handleMarkerClick,
  handleMarkerDrag,
}) => {
  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          label={marker.label}
          draggable={true}
          onClick={() => handleMarkerClick(marker)}
          onDragEnd={(event) => handleMarkerDrag(marker, event)}
        />
      ))}
    </>
  );
};

export default MarkerList;
