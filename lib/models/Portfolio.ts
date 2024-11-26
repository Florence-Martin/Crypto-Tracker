import { Schema, model, models } from "mongoose";

const PortfolioSchema = new Schema({
  userId: { type: String, required: true },
  cryptos: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true },
      avgPrice: { type: Number, required: true },
    },
  ],
});

const Portfolio = models.Portfolio || model("Portfolio", PortfolioSchema);
export default Portfolio;
