"use client";

import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { useCrypto } from "../context/CryptoContext";
import { Card } from "@/design-system";
import Loader from "../components/Loader/Loader";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioPage = () => {
  const { portfolio, setPortfolio } = usePortfolio(); // Récupère le portefeuille du contexte
  const { cryptos, isLoading, error } = useCrypto(); // Récupère les cryptos disponibles et leurs prix

  if (!portfolio || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  // console.log("Portfolio Data:", portfolio);

  // Regroupe les cryptos identiques dans le portefeuille pour éviter les doublons
  const groupedPortfolio = portfolio.reduce<
    Record<string, (typeof portfolio)[0]>
  >((accumulator, item) => {
    if (accumulator[item.name]) {
      accumulator[item.name].quantity += item.quantity;
      accumulator[item.name].total_value += item.total_value;
    } else {
      accumulator[item.name] = { ...item };
    }
    return accumulator;
  }, {});

  const portfolioArray = Object.values(groupedPortfolio);
  // console.log("Portfolio Array:", portfolioArray);

  // Vérifie que les données sont correctement définies
  portfolioArray.forEach((item) => {
    // console.log("Portfolio Item:", item);
  });

  // Synchronise les prix actuels des cryptos et calcule les pourcentages
  const updatedPortfolio = portfolioArray.map((item) => {
    const matchingCrypto = cryptos.find((crypto) => crypto.id === item.id);

    return {
      ...item,
      current_price: matchingCrypto?.current_price || item.current_price || 0,
      total_value:
        item.quantity *
        (matchingCrypto?.current_price || item.current_price || 0),
      priceChange:
        matchingCrypto?.price_change_percentage_24h ||
        item.price_change_percentage_24h ||
        0,
    };
  });

  // console.log("Updated Portfolio:", updatedPortfolio);

  // Calcul de la valeur totale du portefeuille
  const totalPortfolioValue = updatedPortfolio.reduce(
    (accumulator, item) => accumulator + item.total_value,
    0
  );

  // Génération des couleurs aléatoires pour le graphique
  const generateColors = (length: number) =>
    Array.from(
      { length },
      () =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.6)`
    );

  const chartColors = generateColors(updatedPortfolio.length);

  const chartData = {
    labels: updatedPortfolio.map((item) => item.name),
    datasets: [
      {
        label: "Portfolio Distribution",
        data: updatedPortfolio.map((item) => item.total_value),
        backgroundColor: chartColors,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as "top" | "left" | "bottom" | "right",
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  const dataToDisplay =
    chartData.datasets[0].data.length > 0
      ? chartData
      : { labels: [], datasets: [] };

  // Fonction pour supprimer une Card
  const handleDeleteCard = (id: string) => {
    const updatedPortfolio = portfolio.filter((item) => item.id !== id);
    setPortfolio(updatedPortfolio); // Met à jour le portefeuille via le contexte
  };

  return (
    <div className="mx-4 p-4 my-16 md:my-12">
      <h1 className="text-2xl font-bold mb-4">My Wallet</h1>

      {updatedPortfolio.length === 0 ? (
        <p className="text-gray-500 text-center">
          Your wallet is empty. Start adding cryptos to track your investments!
        </p>
      ) : (
        <>
          {/* Graphique */}
          <div className="mx-4 mt-16 md:mt-8 flex justify-center items-center">
            <div className="w-full max-w-lg h-64">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Portfolio Distribution
              </h2>
              <Pie data={dataToDisplay} options={chartOptions} />
            </div>
          </div>

          <h3 className="text-xl font-bold mt-12 text-center">
            Total wallet value: ${totalPortfolioValue.toFixed(2)}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-gray-800 mt-8">
            {updatedPortfolio.map((item, index) => (
              <Card
                key={`${item.id}-${index}`}
                name={item.name || "Unknown"}
                symbol={item.symbol || ""}
                price={item.current_price}
                quantity={item.quantity}
                totalValue={item.total_value.toFixed(2)}
                priceChange={item.priceChange}
                image={item.image || ""}
                onDelete={() => handleDeleteCard(item.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioPage;
