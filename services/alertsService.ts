import { CryptoData } from "@/app/components/Table/Table";

// ajout d'une alerte
export async function addAlertToDatabase(crypto: CryptoData, userId: string) {
  if (!crypto) {
    console.error("Crypto data is missing.");
    return;
  }

  // Construire l'objet alert avec des valeurs par défaut
  const alertData = {
    name: crypto.name || "Unknown",
    symbol: crypto.symbol || "Unknown",
    price: crypto.current_price ?? crypto.price ?? 0, // Utilisation de valeurs par défaut
    priceChange: crypto.price_change_percentage_24h ?? crypto.priceChange ?? 0,
    timestamp: new Date().toISOString(),
  };

  console.log("Alert data being sent to API:", alertData);

  try {
    const response = await fetch("/api/alert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        alerts: [alertData],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to add alert to MongoDB. Please try again."
      );
    }

    console.log(`Alert for ${crypto.name} added successfully.`);
  } catch (error) {
    console.error("Error adding alert to MongoDB:", error);
  }
}

// suppression des alertes
export async function removeAlertFromDatabase(symbol: string, userId: string) {
  try {
    const response = await fetch(
      `/api/alert?userId=${userId}&symbol=${symbol}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          "Failed to remove alert from MongoDB. Please try again."
      );
    }

    console.log(`Alert for symbol "${symbol}" removed successfully.`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error removing alert from MongoDB:", error.message);
    } else {
      console.error("Error removing alert from MongoDB:", error);
    }
  }
}
