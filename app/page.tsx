"use client";

import React, { useState, useEffect } from "react";
import { useCrypto } from "../context/CryptoContext";
import { usePortfolio } from "../context/PortfolioContext";
import Loader from "@/components/Loader/Loader";
import Hero from "../components/Hero";
import { CryptoDashboard } from "../components/Crypto/CryptoDashboard";
import { BadgeDollarSign, List, BarChart } from "lucide-react";
import { Button } from "@/design-system";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import debounce from "lodash/debounce";
import PortfolioOverview from "../components/Wallet/PortfolioOverview";
import CryptoAlert from "@/components/CryptoAlert/CryptoAlert";
import { CryptoTable } from "../components/Table/Cryptotable";
import { CryptoGraph } from "@/components/Graph/CryptoGraph";
import { WalletModal } from "../components/Wallet/WalletModal";
import { SearchBar } from "@/components/Searchbar/SearchBar";

const HomePage: React.FC = () => {
  const { cryptos, isLoading, error } = useCrypto();
  const { addToPortfolio } = usePortfolio();

  const [filteredCryptos, setFilteredCryptos] = useState(cryptos || []);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [view, setView] = useState<"table" | "graph">("table");
  const [alerts, setAlerts] = useState<
    {
      name: string;
      symbol: string;
      current_price: number;
      priceChange: number;
      price_change_percentage_24h: number;
      image: string;
    }[]
  >(() => {
    // Vérifie si le code est exécuté côté client (navigateur)
    if (typeof window !== "undefined") {
      // Tente de récupérer les alertes déjà sauvegardées dans LocalStorage
      const savedAlerts = localStorage.getItem("crypto-alerts");
      return savedAlerts ? JSON.parse(savedAlerts) : [];
    }
    // Si le code est exécuté côté serveur (lors de l'exécution initiale avec Next.js),
    // retourne un tableau vide pour éviter une erreur liée à l'absence de `localStorage`
    return [];
  });

  useEffect(() => {
    if (cryptos && cryptos.length > 0) {
      setFilteredCryptos(cryptos);
    }
  }, [cryptos]);

  // Sauvegarde les alertes dans LocalStorage dès qu'elles changent
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("crypto-alerts", JSON.stringify(alerts));
    }
  }, [alerts]);

  const handleSearch = debounce((searchTerm: string) => {
    const filtered = cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCryptos(filtered);
  }, 300);

  // Chargement initial depuis MongoDB
  useEffect(() => {
    // Vérifie que le code s'exécute côté client
    if (typeof window !== "undefined") {
      async function fetchAlertsFromMongoDB() {
        try {
          const userId = "12345"; // Remplacez par l'ID utilisateur réel
          const response = await fetch(`/api/alert?userId=${userId}`);

          if (!response.ok) {
            console.error(
              `Erreur lors de la récupération des alertes : ${response.status} ${response.statusText}`
            );
            return;
          }

          const data = await response.json();

          if (Array.isArray(data?.data)) {
            setAlerts(data.data);
            localStorage.setItem("crypto-alerts", JSON.stringify(data.data));
          } else {
            console.error("Les données reçues ne sont pas un tableau :", data);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des alertes :", error);
        }
      }

      fetchAlertsFromMongoDB();
    }
  }, []);

  const alertDetails =
    alerts.length > 0
      ? alerts.map((alert, index) => ({
          id: `${alert.symbol}-${index}`,
          symbol: alert.symbol,
          type: alert.name,
          message: `${alert.name} is being tracked.`,
          timestamp: new Date(),
          image: alert.image,
        }))
      : [
          {
            id: "no-alert",
            type: "No Alerts selected",
            symbol: "",
            message: "You have not selected any alerts.",
            timestamp: new Date(),
            image: "",
          },
        ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="relative w-screen min-h-screen bg-background overflow-auto mb-24">
      <div className=" md:mt-4 mb-10 md:mb-6">
        <Hero />
        <div className="grid grid-cols-1 md:grid-cols-2 border-2">
          <CryptoDashboard />
          <PortfolioOverview />
        </div>
      </div>

      <div className="flex mx-4 flex-col md:flex-row mb-6 justify-center">
        {/* <SearchBar onSearch={handleSearch} /> */}
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Ajout à Wallet + Vue Table/Graph */}
      <div
        id="add_crypto"
        className="flex flex-col md:flex-row gap-4 mx-4 md:mx-auto items-end md:justify-end md:w-full max-w-6xl mb-2"
      >
        <Button
          primary
          label="Add to Wallet"
          onClick={() => setIsWalletOpen(true)}
          icon={<BadgeDollarSign className="h-4 w-4" />}
        ></Button>
        <div className="flex items-center gap-4">
          <Button
            primary={view === "table"}
            label="Table"
            backgroundColor={view === "table" ? "#4CAF50" : "#3F3F46"}
            onClick={() => setView("table")}
            icon={<List className="h-4 w-4" />}
          ></Button>
          <Button
            primary={view === "graph"}
            label="Graph"
            backgroundColor={view === "graph" ? "#4CAF50" : "#3F3F46"}
            onClick={() => setView("graph")}
            icon={<BarChart className="h-4 w-4" />}
          ></Button>
        </div>
      </div>

      {/* Conteneur table + graphe */}
      <div className="flex flex-col gap-4 mx-4 md:mx-auto items-stretch md:w-full max-w-6xl rounded-lg border-2 dark:border-white">
        {/* Table */}
        <div
          className={`transition-all duration-300 h-full ${
            view === "table" ? "block" : "hidden"
          } block`}
        >
          <CryptoTable
            cryptos={filteredCryptos.map((crypto) => ({
              name: crypto.name,
              symbol: crypto.symbol,
              current_price: crypto.current_price ?? 0,
              priceChange: crypto.price_change_percentage_24h ?? 0,
              image: crypto.image,
            }))}
            alerts={alerts}
            onAlertChange={(updatedAlerts) =>
              setAlerts(
                updatedAlerts.map((alert) => ({
                  ...alert,
                  current_price: alert.current_price ?? 0,
                  price_change_percentage_24h:
                    alert.price_change_percentage_24h ?? 0,
                }))
              )
            }
          />
        </div>
        {/* Graph */}
        <div
          className={`transition-all duration-300 h-full ${
            view === "graph" ? "block" : "hidden"
          } block`}
        >
          {filteredCryptos.length > 1 ? (
            <Card className="mb-6 h-full">
              <CardHeader>
                <CardTitle>Cryptocurrency Prices</CardTitle>
                <CardDescription>Real-time cryptocurrency data</CardDescription>
              </CardHeader>
              <CryptoGraph
                data={filteredCryptos.map((crypto, index) => ({
                  name: crypto.name,
                  current_price: crypto.current_price,
                  fill: `hsl(var(--chart-${(index % 3) + 1}))`,
                }))}
                chartConfig={{
                  current_price: {
                    label: "Current Price",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              />
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="font-medium">Real-time updates</div>
              </CardFooter>
            </Card>
          ) : (
            <p className="text-center text-muted-foreground">
              Not enough data to display the graph.
            </p>
          )}
        </div>
      </div>
      {/* Alertes */}
      <CryptoAlert alerts={alertDetails} />

      {/* Modal Wallet */}
      {isWalletOpen && (
        <WalletModal
          onClose={() => setIsWalletOpen(false)}
          cryptos={filteredCryptos.map((crypto) => ({
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            current_price: crypto.current_price,
            price_change_percentage_24h:
              crypto.price_change_percentage_24h || 0,
          }))}
          addToPortfolio={(crypto, quantity) => {
            addToPortfolio(crypto, quantity);
            setIsWalletOpen(false);
          }}
        />
      )}
    </main>
  );
};

export default HomePage;
