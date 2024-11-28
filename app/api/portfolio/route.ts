import dbConnect from "../../../lib/dbConnect";
import Portfolio from "../../../lib/models/Portfolio";
import { NextResponse } from "next/server";
import Joi from "joi";

const portfolioSchema = Joi.object({
  userId: Joi.string().required(),
  cryptos: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      symbol: Joi.string().required(),
      quantity: Joi.number().positive().required(),
      totalValue: Joi.number().required().min(0), // toujours initialisé
      priceHistory: Joi.array().items(
        Joi.object({
          date: Joi.date().required(),
          price: Joi.number().positive().required(),
        })
      ),
    })
  ),
});

// Gestionnaire pour les requêtes GET
export async function GET(_req: Request) {
  try {
    await dbConnect();

    const url = new URL(_req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const portfolios = await Portfolio.find({})
      .skip(skip)
      .limit(limit)
      .select("userId cryptos");

    const total = await Portfolio.countDocuments();

    // console.log("Returning portfolios:", portfolios);
    return NextResponse.json({
      success: true,
      data: portfolios,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
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
    console.log("Connecting to MongoDB...");
    await dbConnect();

    const body = await req.json();
    console.log("Received data:", JSON.stringify(body, null, 2)); // Vérifiez ici

    const { error } = portfolioSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { success: false, error: error.details[0].message },
        { status: 400 }
      );
    }

    console.log("Data is valid, creating portfolio...");
    const newPortfolio = await Portfolio.create(body);
    return NextResponse.json({ success: true, data: newPortfolio });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Gestionnaire pour les requêtes DELETE
export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Portfolio ID is required" },
        { status: 400 }
      );
    }

    const deletedPortfolio = await Portfolio.findByIdAndDelete(id);

    if (!deletedPortfolio) {
      return NextResponse.json(
        { success: false, error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedPortfolio });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
