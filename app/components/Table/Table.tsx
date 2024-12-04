import { Checkbox } from "@/components/ui/checkbox";
import { IconToast } from "@/design-system";
import { CheckCircle } from "lucide-react";
import React, { useState } from "react";

export interface CryptoData {
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  alert?: boolean;
}

export interface TableProps {
  data: CryptoData[]; // Liste des cryptos dans le tableau
  selectedAlerts: CryptoData[]; // Liste des objets crypto sélectionnés
  onAlertChange: (updatedAlerts: CryptoData[]) => void; // Callback pour remonter les alertes
}

export const Table: React.FC<TableProps> = ({
  data,
  selectedAlerts,
  onAlertChange,
}) => {
  const [showToast, setShowToast] = useState(false);

  function onAlertToggle(symbol: string) {
    if (selectedAlerts.some((alert) => alert.symbol === symbol)) {
      // Supprime l'alerte si elle est déjà sélectionnée
      const updatedAlerts = selectedAlerts.filter(
        (alert) => alert.symbol !== symbol
      );
      onAlertChange(updatedAlerts); // Met à jour localement
      removeAlertFromDatabase(symbol); // Supprime de MongoDB
    } else if (selectedAlerts.length < 2) {
      // Ajoute l'alerte si moins de 2 sélectionnées
      const crypto = data.find((crypto) => crypto.symbol === symbol);
      if (!crypto) return;
      const updatedAlerts = [...selectedAlerts, crypto];
      onAlertChange(updatedAlerts); // Met à jour localement
      addAlertToDatabase(symbol); // Ajoute dans MongoDB
    } else {
      // Si limite atteinte, affiche un toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // Cache le toast après 3 secondes
    }
  }

  async function addAlertToDatabase(symbol: string) {
    const crypto = data.find((crypto) => crypto.symbol === symbol);
    if (!crypto) return;

    try {
      const response = await fetch("/api/alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "12345", // Remplacez par l'utilisateur authentifié
          alerts: [
            {
              name: crypto.name,
              symbol: crypto.symbol,
              price: crypto.price,
              priceChange: crypto.priceChange,
              message: `${crypto.name} price is being tracked.`, // Ajoutez un message valide ici
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add alert to MongoDB");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function removeAlertFromDatabase(symbol: string) {
    try {
      const response = await fetch(`/api/alert?userId=12345&symbol=${symbol}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove alert from MongoDB");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="relative">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <IconToast
            title="You can't !"
            icon={<CheckCircle className="text-red-500" />}
            iconSize={24}
            level="error"
            onClose={() => setShowToast(false)}
          >
            You can only select up to 2 alerts.
          </IconToast>
        </div>
      )}

      {/* Tableau */}
      <table className="w-full border-collapse rounded-lg bg-background text-foreground">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-center">Name</th>
            <th className="border border-gray-300 p-2 text-center hidden md:table-cell">
              Symbol
            </th>
            <th className="border border-gray-300 p-2 text-center">
              Price (USD)
            </th>
            <th className="border border-gray-300 p-2 text-center">
              Change (%)
            </th>
            <th className="border border-gray-300 p-2 text-center">Alert</th>
          </tr>
        </thead>
        <tbody>
          {data.map((crypto) => (
            <tr key={crypto.symbol}>
              <td className="border border-gray-300 p-2 text-center">
                {crypto.name}
              </td>
              <td className="border border-gray-300 p-2 text-center hidden md:table-cell">
                {crypto.symbol.toUpperCase()}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                ${crypto.price.toFixed(2)}
              </td>
              <td
                className={`border border-gray-300 p-2 text-center ${
                  crypto.priceChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {crypto.priceChange.toFixed(2)}%
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Checkbox
                    id={`alert-${crypto.symbol}`}
                    checked={selectedAlerts.some(
                      (alert) => alert.symbol === crypto.symbol
                    )}
                    onCheckedChange={() => onAlertToggle(crypto.symbol)}
                    disabled={
                      !selectedAlerts.some(
                        (alert) => alert.symbol === crypto.symbol
                      ) && selectedAlerts.length >= 2
                    } // Désactiver si limite atteinte
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
