import dbConnect from "@/lib/dbConnect";
import Portfolio from "@/lib/models/Portfolio";
import { NextResponse } from "next/server";

// Gestionnaire pour les requêtes GET
export async function GET(_req: Request) {
  try {
    await dbConnect();
    const portfolios = await Portfolio.find({});
    return NextResponse.json({ success: true, data: portfolios });
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
    const newPortfolio = await Portfolio.create(body);
    return NextResponse.json({ success: true, data: newPortfolio });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
