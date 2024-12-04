import dbConnect from "../../../lib/dbConnect";
import { NextResponse } from "next/server";
import Joi from "joi";
import Alert from "@/lib/models/Alert";

interface AlertType {
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  timestamp: Date;
}

// Définition du schéma de validation pour les alertes

export const alertSchema = Joi.object({
  userId: Joi.string().required(), // ID utilisateur requis
  alerts: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(), // Nom de la crypto requis
        symbol: Joi.string().required(), // Symbole requis
        price: Joi.number().required(), // Prix requis
        priceChange: Joi.number().required(), // Variation en pourcentage
        timestamp: Joi.date().required(), // Timestamp requis
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
      return NextResponse.json({ success: true, data: [] });
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
    console.error(error);
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

    const body: { userId: string; alerts: AlertType[] } = await req.json(); // Typage des données reçues

    const { userId, alerts } = body;

    if (!userId || !Array.isArray(alerts)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    let userAlerts = await Alert.findOne({ userId });
    if (!userAlerts) {
      userAlerts = new Alert({ userId, alerts: [] });
    }

    // Ajouter ou mettre à jour les alertes
    alerts.forEach((newAlert: AlertType) => {
      const existingAlertIndex = userAlerts.alerts.findIndex(
        (alert: AlertType) => alert.symbol === newAlert.symbol
      );
      if (existingAlertIndex !== -1) {
        userAlerts.alerts[existingAlertIndex] = newAlert;
      } else {
        userAlerts.alerts.push(newAlert);
      }
    });

    await userAlerts.save();

    return NextResponse.json({ success: true, data: userAlerts });
  } catch (err) {
    console.error(err);
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

    // Récupérer les alertes de l'utilisateur
    const userAlerts = await Alert.findOne({ userId });

    if (!userAlerts || !userAlerts.alerts) {
      return NextResponse.json(
        { success: false, error: "User or alerts not found." },
        { status: 404 }
      );
    }

    // Filtrer les alertes pour supprimer celle correspondant au symbole
    userAlerts.alerts = userAlerts.alerts.filter(
      (alert: { symbol: string }) => alert.symbol !== symbol
    );

    // Sauvegarder les modifications
    await userAlerts.save();

    return NextResponse.json({
      success: true,
      data: userAlerts.alerts, // Retourner les alertes restantes
    });
  } catch (error) {
    console.error("Error during DELETE:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
