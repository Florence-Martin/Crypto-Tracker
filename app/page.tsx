// "use client";

// import React, { useState, useEffect } from "react";
// import Wallet from "./components/Wallet/Wallet";
// import { Table } from "./components/Table/Table";
// import { SearchBar } from "./components/Searchbar/SearchBar";
// import { useCrypto } from "../app/context/CryptoContext";
// import { usePortfolio } from "../app/context/PortfolioContext";

// const HomePage = () => {
//   const { cryptos } = useCrypto(); // Utilise les données de CryptoContext
//   const { addToPortfolio } = usePortfolio(); // Fonction pour ajouter au portefeuille
//   const [filteredCryptos, setFilteredCryptos] = useState(cryptos);

//   useEffect(() => {
//     // Met à jour les cryptomonnaies filtrées si la liste des cryptos change
//     setFilteredCryptos(cryptos);
//   }, [cryptos]);

//   const handleSearch = (value: string) => {
//     const filtered = cryptos.filter((crypto) =>
//       crypto.name.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredCryptos(filtered);
//   };

//   return (
//     <main className="mx-8 my-64 md:my-48">
//       {/* Barre de recherche */}
//       <SearchBar onSearch={handleSearch} />

//       {/* Table des cryptos */}
//       <Table
//         data={filteredCryptos.map((crypto) => ({
//           name: crypto.name,
//           symbol: crypto.symbol,
//           price: crypto.current_price,
//           priceChange: crypto.price_change_percentage_24h,
//         }))}
//       />

//       {/* Composant Wallet */}
//       <Wallet
//         cryptos={filteredCryptos}
//         onAddToPortfolio={(crypto, quantity) => {
//           addToPortfolio(crypto, quantity);
//         }}
//       />
//     </main>
//   );
// };

// export default HomePage;
"use client";

import React, { useState, useEffect } from "react";
import Wallet from "./components/Wallet/Wallet";
import { Table } from "./components/Table/Table";
import { SearchBar } from "./components/Searchbar/SearchBar";
import { useCrypto } from "../app/context/CryptoContext";
import { usePortfolio } from "../app/context/PortfolioContext";
import { LineChart, Line, CartesianGrid, Dot } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer,
} from "@/components/ui/chart";
import { Button } from "@/design-system";

// Configuration des données du graphique
const chartConfig = {
  current_price: {
    label: "Prix actuel",
    color: "hsl(var(--chart-2))",
  },
} as const;

const HomePage: React.FC = () => {
  const { cryptos } = useCrypto(); // Données des cryptomonnaies depuis le contexte
  const { addToPortfolio } = usePortfolio(); // Fonction pour ajouter au portefeuille

  const [filteredCryptos, setFilteredCryptos] = useState(cryptos || []); // Liste des cryptos filtrées
  const [view, setView] = useState<"table" | "graph">("table"); // État pour basculer entre tableau et graphique

  // Met à jour les cryptos filtrées si la liste des cryptos change
  useEffect(() => {
    setFilteredCryptos(cryptos || []);
  }, [cryptos]);

  // Gère la recherche parmi les cryptos
  const handleSearch = (value: string) => {
    const filtered = cryptos.filter((crypto) =>
      crypto.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCryptos(filtered);
  };

  return (
    <main className="mx-8 my-64 md:my-48">
      {/* Barre de recherche */}
      <div className="flex items-center justify-between mb-6">
        <SearchBar onSearch={handleSearch} />

        {/* Boutons pour basculer entre tableau et graphique */}
        <div className="flex gap-4">
          <Button
            primary={view === "table"}
            label="Tableau"
            onClick={() => setView("table")}
            backgroundColor={view === "table" ? "#4CAF50" : "#D3D3D3"}
          />
          <Button
            primary={view === "graph"}
            label="Graphique"
            onClick={() => setView("graph")}
            backgroundColor={view === "graph" ? "#4CAF50" : "#D3D3D3"}
          />
        </div>
      </div>

      {/* Affichage conditionnel */}
      {view === "table" ? (
        <div className="mb-6">
          <Table
            data={filteredCryptos.map((crypto) => ({
              name: crypto.name,
              symbol: crypto.symbol,
              price: crypto.current_price,
              priceChange: crypto.price_change_percentage_24h,
            }))}
          />
        </div>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Prix des Cryptomonnaies</CardTitle>
            <CardDescription>Données en temps réel</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                data={filteredCryptos.map((crypto) => ({
                  name: crypto.name,
                  current_price: crypto.current_price,
                  fill: `hsl(${Math.random() * 360}, 70%, 50%)`, // Génération de couleurs aléatoires
                }))}
                margin={{ top: 24, left: 24, right: 24 }}
              >
                <CartesianGrid vertical={false} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      nameKey="current_price"
                      hideLabel
                    />
                  }
                />
                <Line
                  dataKey="current_price"
                  type="natural"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={({
                    payload,
                    ...props
                  }: {
                    payload: { name: string; fill: string };
                    cx: number;
                    cy: number;
                  }) => (
                    <Dot
                      key={payload.name}
                      r={5}
                      cx={props.cx}
                      cy={props.cy}
                      fill={payload.fill}
                      stroke={payload.fill}
                    />
                  )}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Mise à jour en temps réel des prix
            </div>
            <div className="leading-none text-muted-foreground">
              Données pour les cryptomonnaies disponibles.
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Composant Wallet */}
      <div>
        <Wallet
          cryptos={filteredCryptos}
          onAddToPortfolio={(crypto, quantity) => {
            addToPortfolio(crypto, quantity);
          }}
        />
      </div>
    </main>
  );
};

export default HomePage;
