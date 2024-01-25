import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { MarkerType } from './types/MarkerType';

export const updateFirebaseData = async (markers: MarkerType[]) => {
  const firebaseData = markers.map(({ lat, lng }) => ({
    Location: { Lat: lat, Long: lng },
    Timestamp: new Date(),
    Next: markers.length + 1,
  }));

  const questCollectionRef = collection(db, 'markers');

  await Promise.all(
    firebaseData.map(async (data, index) => {
      await setDoc(doc(questCollectionRef, `Quest ${index + 1}`), data);
    })
  );
};