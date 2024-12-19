import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { IconToast } from "@/design-system";
import { CheckCircle } from "lucide-react";
import {
  addAlertToDatabase,
  removeAlertFromDatabase,
} from "@/services/alertsService";
import Image from "next/image";

export interface CryptoData {
  name: string;
  symbol: string;
  priceChange: number;
  current_price?: number;
  price_change_percentage_24h?: number;
  alert?: boolean;
  image: string;
}

export interface TableProps {
  data: CryptoData[];
  selectedAlerts: CryptoData[];
  onAlertChange: (updatedAlerts: CryptoData[]) => void;
}

export const Table: React.FC<TableProps> = ({
  data,
  selectedAlerts,
  onAlertChange,
}) => {
  const [showToast, setShowToast] = useState(false);

  const userId = "12345"; // À remplacer par l'ID utilisateur réel

  function onAlertToggle(symbol: string) {
    // Recherche la crypto-monnaie correspondante dans les données
    const crypto = data.find((crypto) => crypto.symbol === symbol);
    if (!crypto) {
      console.error(`Crypto with symbol "${symbol}" not found.`);
      return;
    }

    // Vérifie si le symbole est déjà présent dans les alertes sélectionnées
    if (selectedAlerts.some((alert) => alert.symbol === symbol)) {
      // Supprime l'alerte si elle est déjà sélectionnée
      const updatedAlerts = selectedAlerts.filter(
        (alert) => alert.symbol !== symbol
      );

      // Met à jour l'état local avec les nouvelles alertes
      onAlertChange(updatedAlerts);

      // Supprime l'alerte dans la base de données (via API)
      removeAlertFromDatabase(symbol, userId);
    } else if (selectedAlerts.length < 2) {
      // Ajoute une nouvelle alerte si le nombre maximum n'est pas atteint
      const updatedAlerts = [...selectedAlerts, { ...crypto, alert: true }];

      // Met à jour l'état local avec les nouvelles alertes
      onAlertChange(updatedAlerts);

      // Ajoute l'alerte dans la base de données (via API)
      addAlertToDatabase(
        {
          ...crypto,
          current_price: crypto.current_price ?? 0, // Défaut à 0 si manquant
          priceChange: crypto.price_change_percentage_24h ?? 0, // Défaut à 0 si manquant
        },
        userId
      );
    } else {
      // Affiche un toast si le nombre maximum d'alertes est atteint
      setShowToast(true);

      // Cache le toast après 3 secondes
      setTimeout(() => setShowToast(false), 3000);
    }
  }

  return (
    <div className="relative">
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

      <table className="w-full border-collapse  bg-background text-foreground">
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
              <td className="border border-gray-300 p-2 text-left">
                <Image
                  src={crypto.image}
                  alt={`${name} logo`}
                  className="rounded-full flex md:inline-block mr-10"
                  width={36}
                  height={36}
                />
                {crypto.name}
              </td>
              <td className="border border-gray-300 p-2 text-center hidden md:table-cell">
                {crypto.symbol.toUpperCase()}
              </td>
              <td className="border border-gray-300 p-2 text-end">
                $
                {crypto.current_price !== undefined
                  ? crypto.current_price
                      .toLocaleString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : "N/A"}
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
                    }
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
