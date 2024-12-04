"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types pour les cryptomonnaies et le portefeuille
interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h?: number;
  quantity?: number; // Propriété optionnelle pour la quantité
  priceHistory?: { date: string; price: number }[]; // Propriété optionnelle pour l'historique des prix
}

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  current_price: number;
  price_change_percentage_24h: number;
  total_value: number;
  priceHistory: { date: string; price: number }[];
}

interface PortfolioContextProps {
  portfolio: PortfolioItem[];
  addToPortfolio: (crypto: Crypto, quantity: number) => Promise<void>;
  loadPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextProps | undefined>(
  undefined
);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  /**
   * Charge le portefeuille depuis le backend
   */
  const loadPortfolio = async () => {
    try {
      const response = await fetch("/api/portfolio");
      const data = await response.json();

      if (data.success) {
        console.log("Portefeuille chargé depuis le backend :", data.data);

        const normalizedPortfolio = data.data.flatMap(
          (item: { userId: string; cryptos: Crypto[] }) =>
            item.cryptos.map((crypto: Crypto) => ({
              id: crypto.id,
              name: crypto.name,
              symbol: crypto.symbol,
              quantity: crypto.quantity || 0,
              current_price: crypto.current_price || 0,
              price_change_percentage_24h:
                crypto.price_change_percentage_24h || 0,
              total_value: (crypto.quantity || 0) * (crypto.current_price || 0),
              priceHistory: crypto.priceHistory || [],
            }))
        );

        setPortfolio(normalizedPortfolio);
      } else {
        console.error("Erreur lors du chargement :", data.error);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du portefeuille :", error);
    }
  };

  /**
   * Ajoute une cryptomonnaie au portefeuille
   */
  const addToPortfolio = async (
    crypto: {
      id: string;
      name: string;
      symbol: string;
      current_price: number;
      price_change_percentage_24h?: number;
    },
    quantity: number
  ) => {
    if (!crypto || quantity <= 0) {
      console.error("Invalid crypto data or quantity provided.");
      return;
    }

    const currentDate = new Date().toISOString();

    const newCrypto = {
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      quantity,
      totalValue: parseFloat((quantity * crypto.current_price).toFixed(2)), // Calcul correct de totalValue
      priceHistory: [{ date: currentDate, price: crypto.current_price }], // Historique valide
    };

    const portfolioData = {
      userId: "12345",
      cryptos: [newCrypto],
    };

    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolioData),
      });

      if (response.ok) {
        await loadPortfolio(); // Recharge les données après ajout
      } else {
        console.error(
          "Erreur lors de l'ajout au backend :",
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la synchronisation avec le backend :",
        error
      );
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{ portfolio, addToPortfolio, loadPortfolio }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextProps => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
