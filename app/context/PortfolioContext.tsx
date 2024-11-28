"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  priceHistory: { date: string; price: number }[];
}

interface PortfolioContextProps {
  portfolio: PortfolioItem[];
  addToPortfolio: (crypto: Crypto, quantity: number) => Promise<void>;
  loadPortfolio: () => Promise<void>;
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
   * Charge le portefeuille depuis le backend
   */
  const loadPortfolio = async () => {
    try {
      const response = await fetch("/api/portfolio");
      const data = await response.json();
      if (data.success) {
        const normalizedPortfolio = data.data.flatMap(
          (item: { userId: string; cryptos: Crypto[] }) =>
            item.cryptos.map((crypto: Crypto) => ({
              ...crypto,
              userId: item.userId,
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
  const addToPortfolio = async (crypto: Crypto, quantity: number) => {
    const existingCrypto = portfolio.find((item) => item.id === crypto.id);

    if (!crypto || quantity <= 0) {
      console.error("Invalid crypto data or quantity provided.");
      return;
    }
    if (existingCrypto) {
      console.error("Crypto already present in the portfolio.");
      return;
    }

    const currentDate = new Date().toISOString();

    // Construction des données pour une crypto
    const newCrypto = {
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      quantity,
      totalValue: quantity * crypto.current_price, // Calcul correct de totalValue
      priceHistory: [{ date: currentDate, price: crypto.current_price }], // Historique valide
    };

    // Construction des données pour le backend
    const portfolioData = {
      userId: "12345", // ID utilisateur fictif pour tester
      cryptos: [newCrypto], // Format attendu par le backend
    };

    console.log("Données envoyées au backend :", portfolioData);

    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolioData),
      });

      const data = await response.json();

      if (data.success) {
        await loadPortfolio(); // Recharge les données après ajout
      } else {
        console.error("Erreur lors de l'ajout au backend :", data.error);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la synchronisation avec le backend :",
        error
      );
    }
  };

  // Charger les données au démarrage
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

// Hook pour accéder au contexte du portefeuille
export const usePortfolio = (): PortfolioContextProps => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
