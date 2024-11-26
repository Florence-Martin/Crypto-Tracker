import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({
      success: true,
      message: "Connected to MongoDB!",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
