import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate the ID format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Connect to GORTDB
    const client = await clientPromise;
    const db = client.db("GORTDB");

    // Find the document by ID
    const doc = await db.collection("images").findOne({
      _id: new ObjectId(id),
    });

    // Return 404 if doc or file data is missing
    if (!doc || !doc.file_data) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Extract binary buffer from BSON
    const buffer = Buffer.from(doc.file_data.buffer);
    const fileName = doc.FILENAME || `${id}.fits`;

    // Stream file as a FITS download
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/fits",
        "Content-Length": buffer.length.toString(),
      },
    });

  } catch (err: any) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: err.message || "Download failed" },
      { status: 500 }
    );
  }
}