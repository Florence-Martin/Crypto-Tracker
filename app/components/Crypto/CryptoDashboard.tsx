"use client";

import React from "react";
import { useCrypto } from "../../context/CryptoContext";
import CryptoPriceCard from "./CryptoPriceCard";

export function CryptoDashboard() {
  const { cryptos, isLoading, error } = useCrypto(); // Récupère les données du contexte

  if (isLoading) {
    return <p>Loading...</p>; // Affiche un message de chargement si nécessaire
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>; // Affiche un message d'erreur
  }

  // Filtrage pour afficher uniquement Bitcoin, Ethereum et Tether
  const selectedCryptos: {
    name: string;
    symbol: string;
    price: number;
    percentageChange: number;
    icon: "dollar" | "diamond" | "leaf";
  }[] = cryptos
    .filter((crypto) =>
      ["bitcoin", "ethereum", "tether"].includes(crypto.id.toLowerCase())
    )
    .map((crypto) => ({
      name: crypto.name,
      symbol: crypto.symbol.toUpperCase(),
      price: crypto.current_price,
      percentageChange: crypto.price_change_percentage_24h,
      icon:
        crypto.id === "bitcoin"
          ? "dollar"
          : crypto.id === "ethereum"
          ? "diamond"
          : "leaf", // Icônes conditionnelles
    }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Popular Cryptocurrencies
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto justify-items-center">
        {selectedCryptos.map((crypto) => (
          <CryptoPriceCard
            key={crypto.symbol}
            name={crypto.name}
            symbol={crypto.symbol}
            price={crypto.price}
            percentageChange={crypto.percentageChange}
            icon={crypto.icon}
          />
        ))}
      </div>
    </div>
  );
}
