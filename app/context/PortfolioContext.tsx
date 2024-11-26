"use client";

import React, { createContext, useContext, useState } from "react";

// Types pour les cryptomonnaies et le portefeuille
interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  current_price: number;
  total_value: number;
  priceHistory: { date: string; price: number }[]; // Historique des prix
}

interface PortfolioContextProps {
  portfolio: PortfolioItem[];
  addToPortfolio: (crypto: Crypto, quantity: number) => void;
}

// Contexte pour gérer le portefeuille
const PortfolioContext = createContext<PortfolioContextProps | undefined>(
  undefined
);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  /**
   * Ajoute une cryptomonnaie au portefeuille
   * @param crypto - Données de la cryptomonnaie
   * @param quantity - Quantité achetée
   */
  const addToPortfolio = (crypto: Crypto, quantity: number) => {
    if (!crypto || quantity <= 0) {
      console.error("Invalid crypto data or quantity provided.");
      return;
    }

    setPortfolio((prevPortfolio) => {
      const existingCrypto = prevPortfolio.find(
        (item) => item.id === crypto.id
      );
      const currentDate = new Date().toISOString();

      if (existingCrypto) {
        // Mise à jour de la cryptomonnaie existante
        return prevPortfolio.map((item) =>
          item.id === crypto.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                total_value: (item.quantity + quantity) * crypto.current_price,
                priceHistory: [
                  ...item.priceHistory,
                  { date: currentDate, price: crypto.current_price },
                ],
              }
            : item
        );
      } else {
        // Ajout d'une nouvelle cryptomonnaie
        return [
          ...prevPortfolio,
          {
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            quantity,
            current_price: crypto.current_price,
            total_value: quantity * crypto.current_price,
            priceHistory: [{ date: currentDate, price: crypto.current_price }],
          },
        ];
      }
    });
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, addToPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
};

// Hook pour accéder au contexte du portefeuille
export const usePortfolio = (): PortfolioContextProps => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
