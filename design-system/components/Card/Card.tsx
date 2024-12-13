import React from "react";
import "./card.css";
import { Button } from "@/design-system";
import { PencilLine, Trash2 } from "lucide-react";

export interface CardProps {
  name: string;
  symbol: string;
  price: number;
  quantity: number;
  totalValue: string;
  priceChange: number;
}

export const Card: React.FC<CardProps> = ({
  name = "Unknown",
  symbol = "",
  price = 0,
  quantity = 0,
  totalValue = "0.00",
  priceChange = 0,
}) => {
  const formattedPriceChange = `${priceChange > 0 ? "+" : ""}${priceChange}%`;
  return (
    <div className="crypto-card">
      <h3>
        {name} ({symbol?.toUpperCase()})
      </h3>
      <div>
        <p>Current Price: ${price.toFixed(2)}</p>
        <p>Quantity: {quantity}</p>
        <p>Total Value: ${totalValue}</p>
        <p className={priceChange >= 0 ? "positive" : "negative"}>
          {formattedPriceChange}
        </p>
      </div>
      <div className="flex justify-end gap-4">
        <Button
          icon={<Trash2 color="red" />}
          size="small"
          primary
          label="Delete"
        />
        <Button
          icon={<PencilLine color="yellow" />}
          size="small"
          primary
          label="Modify"
        />
      </div>
    </div>
  );
};
