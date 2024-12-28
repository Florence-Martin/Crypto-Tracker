import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Index sur userId
    alerts: {
      type: [
        {
          name: { type: String, required: true, default: "Unknown" }, // Valeur par défaut
          symbol: {
            type: String,
            required: true,
            index: true,
            default: "Unknown",
          },
          price: { type: Number, required: true, min: 0, default: 0 }, // Minimum 0 et valeur par défaut
          timestamp: { type: Date, required: true, default: Date.now }, // Date actuelle si manquante
          message: { type: String, default: "" }, // Champ optionnel avec valeur par défaut
          image: { type: String, default: "" },
        },
      ],
      default: [], // Tableau vide par défaut
    },
  },
  { timestamps: true } // Champs createdAt et updatedAt
);

export default mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
