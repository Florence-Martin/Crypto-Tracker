import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID utilisateur requis
  alerts: [
    {
      symbol: { type: String, required: false }, // Symbol peut être optionnel
      message: { type: String, required: true }, // Message requis
      timestamp: { type: Date, required: true }, // Timestamp requis
    },
  ],
});

export default mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
