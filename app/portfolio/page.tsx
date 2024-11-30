"use client";

import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { useCrypto } from "../context/CryptoContext";
import { Card } from "@/design-system";
import Loader from "../components/Loader/Loader";

const PortfolioPage = () => {
  const { portfolio } = usePortfolio(); // Récupère le portefeuille du contexte
  const { cryptos, isLoading, error } = useCrypto(); // Récupère les cryptos disponibles et leurs prix

  if (!portfolio) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  // Regroupe les cryptos identiques dans le portefeuille
  const groupedPortfolio = portfolio.reduce<
    Record<string, (typeof portfolio)[0]>
  >((acc, item) => {
    if (acc[item.id]) {
      acc[item.id].quantity += item.quantity;
      acc[item.id].total_value += item.total_value;
    } else {
      acc[item.id] = { ...item }; // Ajoute un nouvel élément si non existant
    }
    return acc;
  }, {});

  // Transforme l'objet regroupé en tableau
  const portfolioArray = Object.values(groupedPortfolio);

  // Synchronise les prix actuels des cryptos et calcule les pourcentages
  const updatedPortfolio = portfolioArray.map((item) => {
    const matchingCrypto = cryptos.find((crypto) => crypto.id === item.id);

    const currentPrice = matchingCrypto?.current_price || 0;
    const averagePrice =
      item.quantity > 0 ? item.total_value / item.quantity : 0;

    const priceChange =
      averagePrice > 0
        ? ((currentPrice - averagePrice) / averagePrice) * 100
        : 0;

    // Logs pour débogage
    // console.log("Crypto:", item.name);
    // console.log("Current Price:", currentPrice);
    // console.log("Average Price:", averagePrice);
    // console.log("Price Change (%):", priceChange);

    return {
      ...item,
      current_price: currentPrice,
      total_value: item.quantity * currentPrice,
      priceChange: parseFloat(priceChange.toFixed(2)),
    };
  });

  // Calcul de la valeur totale du portefeuille
  const totalPortfolioValue = updatedPortfolio.reduce(
    (acc, item) => acc + item.total_value,
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
            {updatedPortfolio.map((item) => (
              <Card
                key={item.id}
                name={item.name || "Unknown"}
                symbol={item.symbol || ""}
                price={item.current_price}
                quantity={item.quantity}
                totalValue={item.total_value.toFixed(2)}
                priceChange={item.priceChange}
              />
            ))}
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
