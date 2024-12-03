import dbConnect from "../../../lib/dbConnect";
import { NextResponse } from "next/server";
import Joi from "joi";
import Alert from "@/lib/models/Alert";

// Définition du schéma de validation pour les alertes
export const alertSchema = Joi.object({
  userId: Joi.string().required(),
  alerts: Joi.array()
    .items(
      Joi.object({
        symbol: Joi.string().optional(),
        message: Joi.string().required(),
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
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const alerts = await Alert.find({ userId }).select(
      "symbol message timestamp"
    );

    return NextResponse.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
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

    const body = await req.json();
    console.log("Received body:", JSON.stringify(body, null, 2));

    // Valider les données avec Joi
    const { error } = alertSchema.validate(body);

    if (error) {
      console.error("Validation error:", error.details[0].message);
      return NextResponse.json(
        { success: false, error: error.details[0].message },
        { status: 400 }
      );
    }

    // Préparez les données à insérer dans MongoDB
    const alertsToInsert = body.alerts.map(
      (alert: { symbol?: string; message: string; timestamp: Date }) => ({
        userId: body.userId, // Ajoute le userId à chaque alerte
        ...alert, // Inclut symbol, message et timestamp
      })
    );

    // Insérez toutes les alertes d'un coup
    const newAlerts = await Alert.insertMany(alertsToInsert);

    console.log("Alerts created:", newAlerts);
    return NextResponse.json({ success: true, data: newAlerts });
  } catch (err) {
    console.error("Error creating alert:", (err as Error).message);
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

    const deletedAlert = await Alert.findOneAndDelete({ userId, symbol });

    if (!deletedAlert) {
      return NextResponse.json(
        { success: false, error: "Alert not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedAlert });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
