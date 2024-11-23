import React from "react";

export interface TableProps {
  data: {
    name: string;
    symbol: string;
    price: number;
    priceChange: number;
  }[];
}

export const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <table className="w-full border-collapse rounded-lg">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2 text-center">Name</th>
          <th className="border border-gray-300 p-2 text-center">Symbol</th>
          <th className="border border-gray-300 p-2 text-center">
            Price (USD)
          </th>
          <th className="border border-gray-300 p-2 text-center">Change (%)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((crypto) => (
          <tr key={crypto.symbol}>
            <td className="border border-gray-300 p-2 text-center">
              {crypto.name}
            </td>
            <td className="border border-gray-300 p-2 text-center">
              {crypto.symbol.toUpperCase()}
            </td>
            <td className="border border-gray-300 p-2 text-center">
              ${crypto.price.toFixed(2)}
            </td>
            <td
              className={`border border-gray-300 p-2 text-center ${
                crypto.priceChange >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {crypto.priceChange.toFixed(2)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
