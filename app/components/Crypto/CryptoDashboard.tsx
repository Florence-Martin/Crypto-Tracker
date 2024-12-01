"use client";

import React from "react";
import { useCrypto } from "../../context/CryptoContext";
import CryptoPriceCard from "./CryptoPriceCard"; // Composant individuel pour afficher une crypto

export function CryptoDashboard() {
  const { cryptos, isLoading, error } = useCrypto(); // Récupère les données des cryptos via le contexte

  // Affiche un message de chargement si les données sont en cours de récupération
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Affiche un message d'erreur si une erreur survient
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
      name: crypto.name, // Nom de la crypto (ex. "Bitcoin")
      symbol: crypto.symbol.toUpperCase(), // Symbole en majuscules (ex. "BTC")
      price: crypto.current_price, // Prix actuel récupéré depuis l'API
      percentageChange: crypto.price_change_percentage_24h, // Variation en pourcentage sur 24h
      icon:
        // Attribution d'une icône en fonction de l'ID de la crypto
        crypto.id === "bitcoin"
          ? "dollar"
          : crypto.id === "ethereum"
          ? "diamond"
          : ("leaf" as "dollar" | "diamond" | "leaf"), // Icônes conditionnelles pour Tether
    }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Titre principal */}
      <h1 className="text-3xl font-bold text-center mb-8">
        Popular Cryptocurrencies
      </h1>

      {/* Grille des cartes des cryptos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto justify-items-center">
        {selectedCryptos.map((crypto) => (
          <CryptoPriceCard
            key={crypto.symbol} // Clé unique pour chaque composant
            name={crypto.name} // Nom de la crypto
            symbol={crypto.symbol} // Symbole (ex. BTC, ETH)
            price={crypto.price} // Prix actuel
            percentageChange={crypto.percentageChange} // Variation sur 24h
            icon={crypto.icon} // Icône spécifique
          />
        ))}
      </div>
    </div>
  );
}
