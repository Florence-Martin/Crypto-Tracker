import React from "react";
import Image from "next/image";
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
  image: string;
  onDelete?: () => void; // Callback pour la suppression
  onUpdate?: () => void; // Callback pour la modification
}

export const Card: React.FC<CardProps> = ({
  name = "Unknown",
  symbol = "",
  price = 0,
  quantity = 0,
  totalValue = "0.00",
  priceChange = 0,
  image = "",
  onDelete,
  onUpdate,
}) => {
  const formattedPriceChange = `${priceChange > 0 ? "+" : ""}${priceChange}%`;
  return (
    <div className="crypto-card">
      {/* Section Titre avec Image */}
      <div className="flex items-center space-x-4 mb-4">
        {image && (
          <Image
            src={image}
            alt={`${name} logo`}
            className="crypto-image"
            width={50}
            height={50}
          />
        )}
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">{symbol.toUpperCase()}</p>
        </div>
      </div>

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
          onClick={onDelete}
        />
        <Button
          icon={<PencilLine color="orange" />}
          size="small"
          primary
          label="Modify"
          onClick={onUpdate}
        />
      </div>
    </div>
  );
};
