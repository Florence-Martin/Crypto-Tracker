"use client";

import React, { useState } from "react";
import { Button } from "../../../design-system"; // Import du Button depuis votre design-system

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
  const [cryptoInput, setCryptoInput] = useState<string>(""); // Saisie pour l'ID ou le symbole de la crypto
  const [quantity, setQuantity] = useState<string>(""); // Saisie pour la quantité (comme une chaîne)

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Autorise une chaîne vide ou une valeur correspondant à des chiffres (avec décimales)
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const handleAddToPortfolio = () => {
    // Recherche de la crypto correspondante
    const selectedCrypto = cryptos.find(
      (crypto) =>
        crypto.id.toLowerCase() === cryptoInput.toLowerCase() ||
        crypto.symbol.toLowerCase() === cryptoInput.toLowerCase()
    );

    // Validation avant l'ajout
    if (!selectedCrypto) {
      alert("Cryptocurrency not found. Please enter a valid ID or symbol.");
      return;
    }

    const quantityNumber = parseFloat(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      alert("Please enter a valid quantity greater than 0.");
      return;
    }

    // Ajout au portefeuille
    onAddToPortfolio(selectedCrypto, quantityNumber);
    setCryptoInput(""); // Réinitialiser le champ de la crypto
    setQuantity(""); // Réinitialiser le champ de quantité
  };

  return (
    <div className="wallet-container">
      <h2 className="text-xl mt-4 font-bold mb-4">Add to Portfolio</h2>

      {/* Champ pour entrer l'ID ou le symbole de la crypto */}
      <input
        type="text"
        className="mb-4 p-2 border border-gray-300 rounded w-full text-gray-800 placeholder-gray-800"
        value={cryptoInput}
        onChange={(e) => setCryptoInput(e.target.value)}
        placeholder="Enter cryptocurrency ID or symbol (e.g., bitcoin or BTC)"
      />

      {/* Champ pour entrer la quantité */}
      <input
        type="text"
        className="mb-4 p-2 border border-gray-300 rounded w-full text-gray-800 placeholder-gray-800"
        value={quantity}
        onChange={handleQuantityChange}
        placeholder="Enter quantity (e.g., 0.1)"
      />

      {/* Bouton d'ajout */}
      <Button
        primary
        size="medium"
        label="Add"
        onClick={handleAddToPortfolio}
        backgroundColor="#4A90E2"
        color="white"
      />
    </div>
  );
};

export default Wallet;
