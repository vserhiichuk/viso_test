import { InfoWindow } from "@react-google-maps/api";
import { MarkerType } from "../../types/MarkerType";

interface Props {
  selectedMarker: MarkerType;
  setSelectedMarker: (value: null) => void;
  handleDeleteMarker: () => void;
}

const MarkerPopup: React.FC<Props> = ({
  selectedMarker,
  setSelectedMarker,
  handleDeleteMarker,
}) => {
  const handlePopupClose = () => {
    setSelectedMarker(null);
  };

  return (
    <InfoWindow
      position={{
        lat: selectedMarker.lat,
        lng: selectedMarker.lng,
      }}
      onCloseClick={handlePopupClose}
    >
      <div>
        <h5>Назва маркеру: {selectedMarker.label}</h5>

        <button onClick={handleDeleteMarker}>Видалити маркер</button>
      </div>
    </InfoWindow>
  );
};

export default MarkerPopup;
