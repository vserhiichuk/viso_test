import { InfoWindow } from "@react-google-maps/api";
import { MarkerType } from "../../types/MarkerType";

interface Props {
  selectedMarker: MarkerType;
  setSelectedMarker: (value: null) => void;
  handleDeleteMarker: () => void;
}

export const MarkerPopup: React.FC<Props> = ({
  selectedMarker,
  setSelectedMarker,
  handleDeleteMarker,
}) => {
  const { lat, lng, label } = selectedMarker;

  const handlePopupClose = () => {
    setSelectedMarker(null);
  };

  return (
    <InfoWindow
      position={{
        lat,
        lng,
      }}
      onCloseClick={handlePopupClose}
    >
      <div>
        <h5>Назва маркеру: {label}</h5>

        <button onClick={handleDeleteMarker}>Видалити маркер</button>
      </div>
    </InfoWindow>
  );
};
