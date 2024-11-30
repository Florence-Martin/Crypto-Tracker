"use client";

import React, { useState } from "react";
import { CheckCircle, Coins } from "lucide-react";
import { Button, IconToast } from "@/design-system";

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
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleAddToPortfolio = () => {
    setError(null);

    const selectedCrypto = cryptos.find(
      (crypto) => crypto.id === selectedCryptoId
    );

    if (!selectedCrypto) {
      setError("Please select a cryptocurrency.");
      return;
    }

    const quantityNumber = parseFloat(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      return;
    }

    onAddToPortfolio(selectedCrypto, quantityNumber);

    setSelectedCryptoId("");
    setQuantity("");

    console.log("Toast displayed: true");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      console.log("Toast hidden: false");
    }, 3000);
  };

  return (
    <div className="my-8 p-6 bg-card text-card-foreground shadow-md rounded-lg max-w-md mx-auto border border-border">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <Coins className="w-6 h-6 mr-2" />
        Add to my wallet
      </h2>

      {/* Toast */}
      {showToast && (
        <IconToast
          title="Added to wallet"
          icon={<CheckCircle className="text-green-500" />}
          iconSize={24}
          level="success"
          onClose={() => setShowToast(false)}
          immediate
        >
          The cryptocurrency has been successfully added to your wallet.
        </IconToast>
      )}

      {/* Dropdown */}
      <div className="mb-4">
        <label
          htmlFor="crypto-select"
          className="block text-sm font-medium text-muted-foreground mb-2"
        >
          Select a cryptocurrency
        </label>
        <select
          id="crypto-select"
          className="block w-full bg-muted text-foreground border border-border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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

      {/* Input */}
      <div className="mb-4">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-muted-foreground mb-2"
        >
          Enter quantity
        </label>
        <input
          id="quantity"
          type="text"
          className="block w-full bg-muted text-foreground border border-border rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={quantity}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d*\.?\d*$/.test(value)) {
              setQuantity(value);
            }
          }}
          placeholder="e.g., 0.1"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 text-sm text-destructive-foreground bg-destructive p-2 rounded">
          {error}
        </div>
      )}

      {/* Add Button */}
      <Button
        primary
        size="medium"
        label="Add"
        onClick={handleAddToPortfolio}
        backgroundColor="var(--primary)"
        color="var(--primary-foreground)"
      />
    </div>
  );
};

export default Wallet;
