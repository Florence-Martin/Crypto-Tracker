"use client";

import React, { useState, useEffect } from "react";
import { SearchBar } from "./components/Searchbar/SearchBar";
import { useCrypto } from "../app/context/CryptoContext";
import { usePortfolio } from "../app/context/PortfolioContext";
import Loader from "./components/Loader/Loader";
import Hero from "./components/Hero/Hero";
import { CryptoDashboard } from "./components/Crypto/CryptoDashboard";
import { BadgeDollarSign } from "lucide-react";
import { Button } from "@/design-system";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import debounce from "lodash/debounce";
import PortfolioOverview from "./components/Wallet/PortfolioOverview";
import CryptoAlert from "./components/CryptoAlert/CryptoAlert";
import { CryptoTable } from "./components/Table/Cryptotable";
import { CryptoGraph } from "./components/Graph/CryptoGraph";
import { WalletModal } from "./components/Wallet/WalletModal";

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
  >([]);

  useEffect(() => {
    if (cryptos && cryptos.length > 0) {
      setFilteredCryptos(cryptos);
    }
  }, [cryptos]);

  const handleSearch = debounce((searchTerm: string) => {
    const filtered = cryptos.filter((crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCryptos(filtered);
  }, 300);

  const alertDetails =
    alerts.length > 0
      ? alerts.map((alert, index) => ({
          id: `${alert.symbol}-${index}`,
          type: alert.name,
          message: `${alert.name} is being tracked.`,
          timestamp: new Date(),
          image: alert.image,
        }))
      : [
          {
            id: "no-alert",
            type: "No Alerts selected",
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
      <div className="mt-40 md:mt-24 mb-10 md:mb-6">
        {/* Section Hero */}
        <Hero />

        <div className="grid grid-cols-1 md:grid-cols-2 border-2">
          {/* Section Popular Cryptocurrencies */}
          <CryptoDashboard />

          {/* Section Portfolio Overview */}
          <PortfolioOverview />
        </div>
      </div>
      {/* Barre de recherche */}
      <div className="flex mx-4 flex-col md:flex-row mb-6 justify-center">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div
        id="add_crypto"
        className="flex items-center gap-4 mr-8 justify-end mb-2"
      >
        <button
          onClick={() => setIsWalletOpen(true)}
          className="relative flex items-center gap-2 text-md font-semibold text-primary transition group"
        >
          <BadgeDollarSign className="w-6 h-6 relative z-10" />
          <span className="relative z-10">Add to Wallet</span>
          <span className="absolute inset-0 -rotate-6 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-bottom z-0"></span>
        </button>

        <div className="hidden md:flex items-center gap-4">
          <Button
            primary={view === "table"}
            label="Table"
            onClick={() => setView("table")}
            backgroundColor={view === "table" ? "#4CAF50" : "#3F3F46"}
          />
          <Button
            primary={view === "graph"}
            label="Graph"
            onClick={() => setView("graph")}
            backgroundColor={view === "graph" ? "#4CAF50" : "#3F3F46"}
          />
        </div>
      </div>

      {/* Conteneur table + graphe */}
      <div className="flex flex-col md:flex-row gap-4 mx-4 items-stretch">
        {/* Table */}
        <div
          className={`transition-all duration-300 h-full ${
            view === "table" ? "md:w-3/4 w-full" : "md:w-1/4 w-full"
          }`}
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
            view === "graph" ? "md:w-3/4 w-full" : "md:w-1/4 w-full"
          }`}
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
