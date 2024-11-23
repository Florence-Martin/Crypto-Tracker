"use client";

import React, { useState } from "react";
import { Button } from "../../../design-system";
import { Coins } from "lucide-react";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface WalletProps {
  cryptos: Crypto[];
  onAddToPortfolio: (crypto: Crypto, quantity: number) => void;
}

const Wallet: React.FC<WalletProps> = ({ cryptos, onAddToPortfolio }) => {
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(""); // ID de la crypto sélectionnée
  const [quantity, setQuantity] = useState<string>(""); // Quantité saisie
  const [error, setError] = useState<string | null>(null); // Gestion des erreurs

  const handleAddToPortfolio = () => {
    setError(null); // Réinitialise les erreurs

    // Recherche de la crypto sélectionnée
    const selectedCrypto = cryptos.find(
      (crypto) => crypto.id === selectedCryptoId
    );

    // Validation avant l'ajout
    if (!selectedCrypto) {
      setError("Please select a cryptocurrency.");
      return;
    }

    const quantityNumber = parseFloat(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      return;
    }

    // Ajout au portefeuille
    onAddToPortfolio(selectedCrypto, quantityNumber);

    // Réinitialisation des champs
    setSelectedCryptoId("");
    setQuantity("");
  };

  return (
    <div className="mt-8 p-6 bg-gray-900 shadow-md rounded-lg max-w-md mx-auto border border-gray-700">
      <h2 className="text-xl font-bold mb-6 flex items-center text-white">
        <span className=" text-blue-500 mr-2 ">
          <Coins className="w-6 h-6" />
        </span>
        Add to my wallet
      </h2>

      {/* Dropdown pour sélectionner une cryptomonnaie */}
      <div className="mb-4">
        <label
          htmlFor="crypto-select"
          className="block text-sm font-medium text-gray-400 mb-2"
        >
          Select a cryptocurrency
        </label>
        <select
          id="crypto-select"
          className="block w-full bg-gray-800 border border-gray-600 text-white rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={selectedCryptoId}
          onChange={(e) => setSelectedCryptoId(e.target.value)}
        >
          <option value="">Select a cryptocurrency</option>
          {cryptos.map((crypto) => (
            <option key={crypto.id} value={crypto.id}>
              {crypto.name} ({crypto.symbol.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Input pour entrer la quantité */}
      <div className="mb-4">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-400 mb-2"
        >
          Enter quantity
        </label>
        <input
          id="quantity"
          type="text"
          className="block w-full bg-gray-800 border border-gray-600 text-white rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={quantity}
          onChange={(e) => {
            const value = e.target.value;
            // Autorise uniquement les chiffres et les points décimaux
            if (value === "" || /^\d*\.?\d*$/.test(value)) {
              setQuantity(value);
            }
          }}
          placeholder="e.g., 0.1"
        />
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      {/* Bouton d'ajout */}
      <Button
        primary
        size="medium"
        label="Add to Portfolio"
        onClick={handleAddToPortfolio}
        backgroundColor="linear-gradient(to right, #4CAF50, #81C784)"
        color="white"
      />
    </div>
  );
};

export default Wallet;
