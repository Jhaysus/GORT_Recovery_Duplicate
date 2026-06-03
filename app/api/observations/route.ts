import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("DB URL:", process.env.MONGODB_URI)

    const client = await clientPromise;
    const db = client.db("GORTDB");

    const projection = {
      filename: 1,
      "DATE-OBS": 1,
      EXPTIME: 1,
      FILTER: 1,
      IMAGETYP: 1,
      OBJECT: 1,
      OBSERVER: 1,
      UT: 1,
      FRAME_TYPE: 1,
      FN_DATE: 1,
      FN_TIME: 1,
      RA: 1,
      DEC: 1,
    };

    const observations = await db
      .collection("images")
      .find({}, { projection })
      .toArray();

    return NextResponse.json(observations);
  } catch (error) {
    console.error("GET /api/observations failed:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch observations",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}