import { db } from "./firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";

export interface ProductionHistoryEntry {
  date: string;
  volume: number;
  product: string; // Nuevo campo para el tipo de producto
}

// Fetch production history from Firestore
export const fetchProductionHistory = async () => {
  const historyCollection = collection(db, "productionHistory");
  const snapshot = await getDocs(historyCollection);
  return snapshot.docs.map((doc) => doc.data() as ProductionHistoryEntry);
};

// Add a new production history entry to Firestore
export const addProductionHistory = async (entry: ProductionHistoryEntry) => {
  const historyCollection = collection(db, "productionHistory");
  await addDoc(historyCollection, entry);
};
