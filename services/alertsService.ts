import { CryptoData } from "@/components/Table/Table";
const API_URL = "/api/alert";

export interface AlertData {
  name: string;
  symbol: string;
  price: number;
  timestamp: string; // ISO string
}

function handleApiError(response: Response) {
  if (!response.ok) {
    return response.json().then((data) => {
      throw new Error(data.error || "An unexpected error occurred.");
    });
  }
  return response;
}

// Ajouter une alerte
export async function addAlertToDatabase(
  crypto: CryptoData,
  userId: string
): Promise<AlertData[]> {
  if (!crypto) {
    throw new Error("Crypto data is missing.");
  }

  const alertData: AlertData = {
    name: crypto.name || "Unknown",
    symbol: crypto.symbol || "Unknown",
    price: crypto.current_price ?? 0,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, alerts: [alertData] }),
    });

    await handleApiError(response);
    return response.json(); // Retourne les alertes mises à jour
  } catch (error) {
    console.error("Error adding alert to MongoDB:", error);
    throw error;
  }
}

// Supprimer une alerte
export async function removeAlertFromDatabase(
  symbol: string,
  userId: string
): Promise<AlertData[]> {
  try {
    const response = await fetch(
      `${API_URL}?userId=${userId}&symbol=${symbol}`,
      {
        method: "DELETE",
      }
    );

    await handleApiError(response);
    return response.json(); // Retourne les alertes restantes
  } catch (error) {
    console.error("Error removing alert from MongoDB:", error);
    throw error;
  }
}

// Récupérer les alertes
export async function fetchAlertsFromDatabase(
  userId: string
): Promise<AlertData[]> {
  try {
    const response = await fetch(`${API_URL}?userId=${userId}`);
    await handleApiError(response);
    const data = await response.json();
    return data.data; // Retourne uniquement les données
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
}
