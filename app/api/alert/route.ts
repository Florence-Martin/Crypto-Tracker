import dbConnect from "../../../lib/dbConnect";
import { NextResponse } from "next/server";
import Joi from "joi";
import Alert from "@/lib/models/Alert";

interface AlertType {
  name: string;
  symbol: string;
  price: number;
  timestamp: Date;
}

// Schéma de validation avec Joi
const alertSchema = Joi.object({
  userId: Joi.string().required(),
  alerts: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        symbol: Joi.string().required(),
        price: Joi.number().required(),
        timestamp: Joi.date().required(),
      })
    )
    .required(),
});

// Gestionnaire pour les requêtes GET
export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const userId: string | null = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const userAlerts = await Alert.findOne({ userId });

    if (!userAlerts || userAlerts.alerts.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "No alerts found",
      });
    }

    // Supprimer les doublons
    const uniqueAlerts: AlertType[] = userAlerts.alerts.reduce(
      (acc: AlertType[], alert: AlertType) => {
        if (!acc.some((a: AlertType) => a.symbol === alert.symbol)) {
          acc.push(alert);
        }
        return acc;
      },
      []
    );

    return NextResponse.json({ success: true, data: uniqueAlerts });
  } catch (error) {
    console.error("Error in GET /api/alert:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Gestionnaire pour les requêtes POST
export async function POST(req: Request) {
  try {
    await dbConnect();

    // Étape 1 : Lire et parser le corps de la requête
    const body = await req.json();

    // Étape 2 : Nettoyer les alertes pour s'assurer que toutes les données nécessaires sont présentes
    if (Array.isArray(body.alerts)) {
      body.alerts = body.alerts.map((alert: Partial<AlertType>) => ({
        name: alert.name || "Unknown",
        symbol: alert.symbol || "Unknown",
        price: alert.price ?? 0, // Valeur par défaut si le prix est manquant
        timestamp: alert.timestamp || new Date(), // Date actuelle si aucune date n'est fournie
      }));
    }

    // Étape 3 : Valider les données avec Joi
    const { error } = alertSchema.validate(body);
    if (error) {
      console.error("Validation errors:", error.details);
      return NextResponse.json(
        { success: false, error: error.details },
        { status: 400 }
      );
    }

    const { userId, alerts } = body;

    // Étape 4 : Chercher ou créer un document d'alertes pour l'utilisateur
    const updateResult = await Alert.findOneAndUpdate(
      { userId },
      {
        $set: { userId },
        $addToSet: { alerts: { $each: alerts } }, // Ajoute uniquement des alertes uniques
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updateResult });
  } catch (err) {
    console.error("Error in POST /api/alert:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

// Gestionnaire pour les requêtes DELETE
export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const symbol = url.searchParams.get("symbol");

    if (!userId || !symbol) {
      return NextResponse.json(
        { success: false, error: "userId and symbol are required" },
        { status: 400 }
      );
    }

    // Supprimer l'alerte correspondante pour l'utilisateur
    const updateResult = await Alert.findOneAndUpdate(
      { userId },
      { $pull: { alerts: { symbol } } }, // Supprime l'alerte avec le symbole donné
      { new: true }
    );

    if (!updateResult) {
      return NextResponse.json(
        { success: false, error: "User or alert not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updateResult.alerts, // Retourner les alertes restantes
    });
  } catch (error) {
    console.error("Error in DELETE /api/alert:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
