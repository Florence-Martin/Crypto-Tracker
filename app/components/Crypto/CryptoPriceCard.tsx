import Image from "next/image";
import React from "react";

interface CryptoPriceCardProps {
  name: string;
  symbol: string;
  price: number;
  percentageChange: number;
  image: string;
}

const CryptoPriceCard: React.FC<CryptoPriceCardProps> = ({
  name,
  symbol,
  price,
  percentageChange,
  image,
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg text-center flex flex-col items-center w-64 h-52">
      <Image
        src={image}
        alt={`${name} logo`}
        className="rounded-full"
        width={64}
        height={64}
      />
      <h2 className="text-xl font-bold mt-2">{name}</h2>
      <p className="text-gray-600">{symbol}</p>
      <p className="text-lg font-semibold">${price.toFixed(2)}</p>
      <p
        className={`text-sm ${
          percentageChange >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {percentageChange.toFixed(2)}%
      </p>
    </div>
  );
};

export default CryptoPriceCard;
