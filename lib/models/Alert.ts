import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID utilisateur requis
  alerts: {
    type: [
      {
        name: { type: String, required: true }, // Nom de la crypto
        symbol: { type: String, required: true }, // Symbole de la crypto
        price: { type: Number, required: true }, // Prix actuel
        priceChange: { type: Number, required: true }, // Changement en pourcentage
        timestamp: { type: Date, required: true }, // Timestamp requis
        message: { type: String, required: false },
      },
    ],
    default: [], // Définit une valeur par défaut (tableau vide)
  },
});

export default mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
