import Image from "next/image";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  crypto: {
    name: string;
    symbol: string;
    image: string;
    price: number;
    priceChange: number;
    quantity: number;
    totalValue: number;
  } | null;
}

export const CryptoDetailsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  crypto,
}) => {
  if (!isOpen || !crypto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <button className="absolute top-4 right-4" onClick={onClose}>
          Close
        </button>
        <div className="text-center">
          <Image
            src={crypto.image}
            alt={crypto.name}
            width={96}
            height={96}
            className="w-24 h-24 mx-auto mb-4"
          />
          <h2 className="text-xl font-bold">{crypto.name}</h2>
          <p>Symbol: {crypto.symbol}</p>
          <p>Price: ${crypto.price.toFixed(2)}</p>
          <p>Price Change: {crypto.priceChange.toFixed(2)}%</p>
          <p>Quantity: {crypto.quantity}</p>
          <p>Total Value: ${crypto.totalValue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
