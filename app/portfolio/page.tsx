"use client";

import React, { useState } from "react";
import { usePortfolio, PortfolioItem } from "../../context/PortfolioContext";
import { useCrypto } from "../../context/CryptoContext";
import { Card } from "@/design-system";
import Loader from "../../components/Loader/Loader";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import CryptoModal from "../../design-system/components/Modal/CryptoModal";
import { useCurrency } from "../../context/CurrencyContext"; // Contexte devise
import { convertCurrency } from "../../lib/convertCurrency"; // Fonction de conversion

ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioPage = () => {
  const { portfolio, setPortfolio } = usePortfolio(); // Contexte du portefeuille
  const { cryptos, isLoading, error } = useCrypto(); // Contexte des cryptos
  const { currency, conversionRate } = useCurrency(); // Contexte devise
  const [isEditing, setIsEditing] = useState(false);
  const [editingCard, setEditingCard] = useState<PortfolioItem | null>(null);

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

  // Regroupement des cryptos identiques
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

  // Mise à jour des cryptos avec les données actuelles
  const updatedPortfolio = portfolioArray.map((item) => {
    const matchingCrypto = cryptos.find((crypto) => crypto.id === item.id);

    const currentPrice =
      matchingCrypto?.current_price || item.current_price || 0;
    const totalValue = item.quantity * currentPrice;

    return {
      ...item,
      current_price: currentPrice,
      total_value: totalValue,
      priceChange:
        matchingCrypto?.price_change_percentage_24h ||
        item.price_change_percentage_24h ||
        0,
      image: matchingCrypto?.image || item.image || "",
      converted_price: convertCurrency(currentPrice, conversionRate, currency),
      converted_total_value: convertCurrency(
        totalValue,
        conversionRate,
        currency
      ),
    };
  });
  // console.log("Updated Portfolio:", updatedPortfolio);

  // Calcul de la valeur totale du portefeuille
  const totalPortfolioValue = updatedPortfolio.reduce(
    (acc, item) => acc + item.total_value,
    0
  );

  const convertedTotalPortfolioValue = convertCurrency(
    totalPortfolioValue,
    conversionRate,
    currency
  );

  // Configuration du graphique
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
        position: "bottom" as const,
        labels: { font: { size: 14 } },
      },
    },
  };

  // Suppression d'une Card
  const handleDeleteCard = (documentId: string) => {
    if (!documentId) {
      console.error("ID manquant pour la suppression.");
      return;
    }

    fetch(`/api/portfolio?id=${documentId}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setPortfolio((prev) =>
            prev.filter((item) => item._id !== documentId)
          );
        } else {
          console.error("Erreur lors de la suppression :", response.statusText);
        }
      })
      .catch((error) => console.error("Erreur réseau :", error));
  };

  // Mise à jour d'une Card
  const handleUpdateCard = (id: string) => {
    const cardToEdit = portfolio.find((item) => item._id === id);
    if (cardToEdit) {
      setEditingCard(cardToEdit);
      setIsEditing(true);
    }
  };

  // Sauvegarde des modifications
  const handleSaveChanges = async (updatedData: {
    action: string;
    quantity: number;
  }) => {
    if (editingCard) {
      try {
        const updatedQuantity =
          updatedData.action === "buy"
            ? editingCard.quantity + updatedData.quantity
            : editingCard.quantity - updatedData.quantity;

        const updatedTotalValue = updatedQuantity * editingCard.current_price;

        const updatedPortfolio = {
          userId: "12345",
          cryptos: [
            {
              id: editingCard.id,
              name: editingCard.name,
              symbol: editingCard.symbol,
              quantity: updatedQuantity,
              totalValue: updatedTotalValue,
              priceHistory: [
                ...editingCard.priceHistory,
                {
                  date: new Date().toISOString(),
                  price: editingCard.current_price,
                },
              ],
              image: editingCard.image,
            },
          ],
        };

        const response = await fetch(`/api/portfolio?id=${editingCard._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPortfolio),
        });

        if (response.ok) {
          setPortfolio((prev) =>
            prev.map((item) =>
              item._id === editingCard._id
                ? {
                    ...item,
                    quantity: updatedQuantity,
                    total_value: updatedTotalValue,
                  }
                : item
            )
          );
          setIsEditing(false);
          setEditingCard(null);
        } else {
          console.error("Erreur lors de la mise à jour :", response.statusText);
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    }
  };
  return (
    <div className="mx-4 p-4 md:mt-6 mb-20 md:mb-24">
      {updatedPortfolio.length === 0 ? (
        <p className="text-gray-500 text-center">
          Your wallet is empty. Start adding cryptos to track your investments!
        </p>
      ) : (
        <>
          <CryptoModal
            isOpen={isEditing}
            onClose={() => {
              setIsEditing(false);
              setEditingCard(null);
            }}
            onSave={handleSaveChanges}
            initialQuantity={editingCard?.quantity || 0}
            realQuantity={editingCard?.quantity || 0}
          />
          <div className="mx-4 flex justify-center items-center">
            <div className="w-full max-w-lg h-64">
              <h2 className="text-3xl font-semibold mb-4 text-center">
                Portfolio Overview
              </h2>
              <Pie data={chartData} options={chartOptions} />
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-20 text-center">
            Total wallet value:
            <span className="ml-2">
              {convertedTotalPortfolioValue.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )}
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {updatedPortfolio.map((item) => (
              <Card
                key={item._id}
                name={item.name}
                symbol={item.symbol}
                price={item.current_price}
                quantity={item.quantity}
                totalValue={item.converted_total_value.toLocaleString()}
                priceChange={item.priceChange}
                image={item.image}
                onDelete={() => handleDeleteCard(item._id || "")}
                onUpdate={() => handleUpdateCard(item._id || "")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioPage;
