import React from "react";
import Wallet from "./Wallet";

interface WalletModalProps {
  cryptos: {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h?: number; // Si ce champ est optionnel
  }[];
  onClose: () => void;
  addToPortfolio: (
    crypto: {
      id: string;
      name: string;
      symbol: string;
      current_price: number;
      price_change_percentage_24h?: number;
    },
    quantity: number
  ) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  cryptos,
  onClose,
  addToPortfolio,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="relative bg-white p-6 rounded-lg shadow-lg">
      <button onClick={onClose} className="absolute top-2 right-2">
        ✕
      </button>
      <Wallet cryptos={cryptos} onAddToPortfolio={addToPortfolio} />
    </div>
  </div>
);
