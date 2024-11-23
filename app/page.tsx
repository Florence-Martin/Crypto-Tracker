"use client";

import React, { useState, useEffect } from "react";
import Wallet from "./components/Wallet/Wallet";
import { Table } from "./components/Table/Table";
import { SearchBar } from "./components/Searchbar/SearchBar";
import { useCrypto } from "../app/context/CryptoContext";
import { usePortfolio } from "../app/context/PortfolioContext";

const HomePage = () => {
  const { cryptos } = useCrypto(); // Utilise les données de CryptoContext
  const { addToPortfolio } = usePortfolio(); // Fonction pour ajouter au portefeuille
  const [filteredCryptos, setFilteredCryptos] = useState(cryptos);

  useEffect(() => {
    // Met à jour les cryptomonnaies filtrées si la liste des cryptos change
    setFilteredCryptos(cryptos);
  }, [cryptos]);

  const handleSearch = (value: string) => {
    const filtered = cryptos.filter((crypto) =>
      crypto.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCryptos(filtered);
  };

  return (
    <main>
      <div className="mx-8">
        <SearchBar onSearch={handleSearch} />
        <Table
          data={filteredCryptos.map((crypto) => ({
            name: crypto.name,
            symbol: crypto.symbol,
            price: crypto.current_price,
            priceChange: crypto.price_change_percentage_24h,
          }))}
        />
        <Wallet
          cryptos={filteredCryptos}
          onAddToPortfolio={(crypto, quantity) => {
            addToPortfolio(crypto, quantity); // Appelle la fonction pour ajouter au portefeuille
          }}
        />
      </div>
    </main>
  );
};

export default HomePage;
