import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export const fetchCryptos = async (): Promise<Crypto[]> => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
      },
    });
    return response.data as Crypto[];
  } catch (error) {
    console.error("Error fetching cryptos:", error);
    throw new Error("Failed to fetch cryptocurrencies");
  }
};
