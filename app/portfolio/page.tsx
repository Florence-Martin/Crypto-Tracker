"use client";

import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { useCrypto } from "../context/CryptoContext";
import { Card } from "@/design-system";

const PortfolioPage = () => {
  const { portfolio } = usePortfolio(); // Récupère le portefeuille du contexte
  const { cryptos, isLoading, error } = useCrypto(); // Récupère les cryptos disponibles et leurs prix

  // Vérifie si les données sont chargées
  if (!portfolio) {
    return <p>Loading...</p>;
  }

  // Synchronise les prix actuels des cryptos dans le portefeuille
  const updatedPortfolio = portfolio.map((item) => {
    const matchingCrypto = cryptos.find((crypto) => crypto.id === item.id);
    return {
      ...item,
      current_price: matchingCrypto?.current_price || item.current_price || 0,
      total_value: item.total_value || 0,
      quantity: item.quantity || 0,
    };
  });

  // Calcul de la valeur totale du portefeuille
  const totalPortfolioValue = updatedPortfolio.reduce(
    (acc, item) => acc + item.quantity * (item.current_price || 0),
    0
  );

  return (
    <div className="p-4 my-64 md:my-48">
      <h1 className="text-2xl font-bold mb-4">My Wallet</h1>

      {isLoading && <p>Loading cryptos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {updatedPortfolio.length === 0 ? (
        <p className="text-gray-500">
          Your wallet is empty. Start adding cryptos to track your investments!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-gray-800">
            {updatedPortfolio.map((item, index) => {
              // Calcul du prix moyen d'achat
              const averagePrice =
                item.quantity > 0 ? item.total_value / item.quantity : 0;

              // Calcul du pourcentage de changement
              const priceChange =
                averagePrice > 0
                  ? ((item.current_price - averagePrice) / averagePrice) * 100
                  : 0;

              return (
                <Card
                  key={`${item.id}-${index}`}
                  name={item.name || "Unknown"}
                  symbol={item.symbol || ""}
                  price={item.current_price || 0}
                  quantity={item.quantity || 0}
                  totalValue={(item.total_value || 0).toFixed(2)}
                  priceChange={parseFloat(priceChange.toFixed(2))}
                />
              );
            })}
          </div>
          <h3 className="text-xl font-bold mt-4">
            Total wallet value: ${totalPortfolioValue.toFixed(2)}
          </h3>
        </>
      )}
    </div>
  );
};

export default PortfolioPage;
