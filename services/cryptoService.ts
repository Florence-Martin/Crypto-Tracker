import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

export const fetchCryptos = async (): Promise<Crypto[]> => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
        sparkline: false, // Pas besoin des graphiques de tendance
      },
    });
    if (!Array.isArray(response.data)) {
      throw new Error("Unexpected API response format");
    }

    // Mapper les données et inclure les icônes
    return response.data.map((crypto: Crypto) => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      current_price: crypto.current_price,
      price_change_percentage_24h: crypto.price_change_percentage_24h,
      image: crypto.image, // Récupération de l'URL de l'icône
    })) as Crypto[];
  } catch (error) {
    console.error("Error fetching cryptos:", error);
    throw new Error("Failed to fetch cryptocurrencies");
  }
};
