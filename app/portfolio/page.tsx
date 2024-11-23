"use client";

import React from "react";
import { Table } from "../components/Table/Table";
import { usePortfolio } from "../context/PortfolioContext";

const PortfolioPage = () => {
  const { portfolio } = usePortfolio();

  const totalPortfolioValue = portfolio.reduce(
    (acc, item) => acc + item.total_value,
    0
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>

      {portfolio.length === 0 ? (
        <p className="text-gray-500">Your portfolio is empty.</p>
      ) : (
        <>
          <Table
            data={portfolio.map((item) => ({
              name: item.name,
              symbol: item.symbol,
              price: item.current_price,
              priceChange: item.total_value,
            }))}
          />
          <h3 className="text-xl font-bold mt-4">
            Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}
          </h3>
        </>
      )}
    </div>
  );
};

export default PortfolioPage;
