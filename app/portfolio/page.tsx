"use client";

import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Card } from "@/design-system";

const PortfolioPage = () => {
  const { portfolio } = usePortfolio();

  // Calcul de la valeur totale du portefeuille
  const totalPortfolioValue = portfolio.reduce(
    (acc, item) => acc + item.total_value,
    0
  );

  return (
    <div className="p-4 my-64 md:my-48">
      <h1 className="text-2xl font-bold mb-4">My Wallet</h1>

      {portfolio.length === 0 ? (
        <p className="text-gray-500">
          Your wallet is empty. Start adding cryptos to track your investments!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-gray-800">
            {portfolio.map((item) => {
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
                  key={item.id}
                  name={item.name}
                  symbol={item.symbol}
                  price={item.current_price}
                  quantity={item.quantity}
                  totalValue={item.total_value.toFixed(2)}
                  priceChange={priceChange}
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
