import { Schema, model, models } from "mongoose";

const PortfolioSchema = new Schema({
  userId: { type: String, required: true },
  cryptos: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true }, // Ajout explicite de _id
      id: { type: String, required: true },
      name: { type: String, required: true },
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true },
      totalValue: { type: Number, required: true },
      priceHistory: [
        {
          date: { type: Date, required: true },
          price: { type: Number, required: true },
        },
      ],
    },
  ],
});

const Portfolio = models.Portfolio || model("Portfolio", PortfolioSchema);

export default Portfolio;
