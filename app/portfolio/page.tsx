"use client";

import React, { useState } from "react";
import { usePortfolio, PortfolioItem } from "../../context/PortfolioContext";
import { useCrypto } from "../../context/CryptoContext";
import { Card } from "@/design-system";
import Loader from "../../components/Loader/Loader";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import CryptoModal from "../../design-system/components/Modal/CryptoModal";

ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioPage = () => {
  const { portfolio, setPortfolio } = usePortfolio(); // Récupère le portefeuille du contexte
  const { cryptos, isLoading, error } = useCrypto(); // Récupère les cryptos disponibles et leurs prix
  const [isEditing, setIsEditing] = useState(false); // État pour afficher la modal
  const [editingCard, setEditingCard] = useState<PortfolioItem | null>(null); // Carte en cours de modification

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

  // Synchronise les prix actuels des cryptos et calcule les pourcentages
  const updatedPortfolio = portfolioArray.map((item) => {
    const matchingCrypto = cryptos.find((crypto) => crypto.id === item.id);

    return {
      ...item,
      _id: item._id, // Assure que _id existe toujours
      current_price: matchingCrypto?.current_price || item.current_price || 0,
      total_value:
        item.quantity *
        (matchingCrypto?.current_price || item.current_price || 0),
      priceChange:
        matchingCrypto?.price_change_percentage_24h ||
        item.price_change_percentage_24h ||
        0,
      image: matchingCrypto?.image || item.image || "",
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
  const handleDeleteCard = (documentId: string) => {
    console.log("ID principal envoyé pour suppression :", documentId);

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
          console.log("Crypto supprimée avec succès !");
        } else {
          console.error("Erreur lors de la suppression :", response.statusText);
        }
      })
      .catch((error) => console.error("Erreur réseau :", error));
  };

  // Fonction pour modifier une Card
  const handleUpdateCard = (id: string) => {
    const cardToEdit = portfolio.find((item) => item._id === id);
    if (cardToEdit) {
      setEditingCard(cardToEdit);
      setIsEditing(true); // Affichez la modal
    }
  };

  // Fonction appelée lorsqu'on sauvegarde les modifications
  const handleSaveChanges = async (updatedData: {
    action: string;
    quantity: number;
  }) => {
    if (editingCard) {
      try {
        // Calcule la nouvelle quantité
        const updatedQuantity =
          updatedData.action === "buy"
            ? editingCard.quantity + updatedData.quantity
            : editingCard.quantity - updatedData.quantity;

        const updatedTotalValue = updatedQuantity * editingCard.current_price;

        // Construit l'objet conforme au modèle MongoDB
        const updatedPortfolio = {
          userId: "12345", // avoir un userId valide
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

        // Envoie la requête PUT avec le bon format
        const response = await fetch(`/api/portfolio?id=${editingCard._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPortfolio),
        });

        if (response.ok) {
          const _result = await response.json();

          // Met à jour le contexte local
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

          console.log("Crypto mise à jour avec succès !");
          setIsEditing(false);
          setEditingCard(null);
        } else {
          console.error(
            "Erreur lors de la mise à jour :",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    }
  };
  console.log("Updated Portfolio :", updatedPortfolio);

  return (
    <div className="mx-4 p-4 md:mt-6 mb-20 md:mb-24">
      {updatedPortfolio.length === 0 ? (
        <p className="text-gray-500 text-center">
          Your wallet is empty. Start adding cryptos to track your investments!
        </p>
      ) : (
        <>
          {/* Modal */}
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
          {/* Graphique */}
          <div className="mx-4 flex justify-center items-center">
            <div className="w-full max-w-lg h-64">
              <h2 className="text-3xl font-semibold mb-4 text-center">
                Portfolio Overview
              </h2>
              <Pie data={dataToDisplay} options={chartOptions} />
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-20 text-center">
            Total wallet value: $
            {totalPortfolioValue
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-gray-800 mt-8">
            {updatedPortfolio.map((item, index) => (
              <Card
                key={`${item._id}-${index}`}
                name={item.name || "Unknown"}
                symbol={item.symbol || ""}
                price={item.current_price}
                quantity={item.quantity}
                totalValue={item.total_value
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                priceChange={item.priceChange}
                image={item.image || ""}
                onDelete={() => {
                  if (item._id) {
                    if (confirm("Are you sure you want to delete this item?")) {
                      handleDeleteCard(item._id);
                    }
                  } else {
                    console.error(
                      "ObjectId est manquant pour cette carte :",
                      item
                    );
                  }
                }}
                onUpdate={() => {
                  if (item._id) {
                    handleUpdateCard(item._id);
                  }
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioPage;
