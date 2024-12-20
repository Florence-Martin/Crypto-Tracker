"use client";

import React from "react";
import { useCrypto } from "../../context/CryptoContext";
import CryptoPriceCard from "./CryptoPriceCard";

export function CryptoDashboard() {
  const { cryptos, isLoading, error } = useCrypto();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  // Filtrage des cryptos pour n'afficher que Bitcoin, Ethereum et Tether
  const selectedCryptos = cryptos
    .filter((crypto) =>
      // On compare l'ID de chaque crypto pour ne garder que les 3 sélectionnées
      ["bitcoin", "ethereum", "tether"].includes(crypto.id.toLowerCase())
    )
    .map((crypto) => ({
      name: crypto.name,
      symbol: crypto.symbol.toUpperCase(),
      price: crypto.current_price,
      percentageChange: crypto.price_change_percentage_24h,
      image: crypto.image,
    }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Titre principal */}
      <h1 className="text-3xl font-bold text-center mb-8">
        Popular Cryptocurrencies
      </h1>

      {/* Grille des cartes des cryptos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto justify-items-center">
        {selectedCryptos.map((crypto) => (
          <CryptoPriceCard
            key={crypto.symbol}
            name={crypto.name}
            symbol={crypto.symbol}
            price={crypto.price}
            percentageChange={crypto.percentageChange}
            image={crypto.image}
          />
        ))}
      </div>
    </div>
  );
}
