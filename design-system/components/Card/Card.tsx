import React from "react";
import "./card.css";

export interface CardProps {
  name: string;
  symbol: string;
  price: number;
  quantity: number;
  totalValue: string;
  priceChange: number;
}

export const Card: React.FC<CardProps> = ({
  name,
  symbol,
  price,
  quantity,
  totalValue,
  priceChange,
}) => {
  return (
    <div className="crypto-card">
      <h3>
        {name} ({symbol.toUpperCase()})
      </h3>
      <p>Current Price: ${price.toFixed(2)}</p>
      <p>Quantity: {quantity}</p>
      <p>Total Value: ${totalValue}</p>
      <p className={priceChange >= 0 ? "positive" : "negative"}>
        {priceChange >= 0 ? "+" : ""}
        {priceChange.toFixed(2)}%
      </p>
    </div>
  );
};
