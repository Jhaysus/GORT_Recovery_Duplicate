import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import AdmZip from "adm-zip";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("GORTDB");
    
    const objectIds = ids.map(id => new ObjectId(id));
    const docs = await db.collection("images")
      .find({ _id: { $in: objectIds } })
      .toArray();

    if (docs.length === 0) {
      return NextResponse.json({ error: "No files found" }, { status: 404 });
    }

    const zip = new AdmZip();

    docs.forEach((doc) => {
      if (doc.file_data) {
        const buffer = doc.file_data.buffer 
          ? Buffer.from(doc.file_data.buffer)
          : Buffer.from(doc.file_data);
        const fileName = doc.FILENAME || `${doc._id}.fits`;
        zip.addFile(fileName, buffer);
      }
    });

    return new Response(zip.toBuffer(), {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="gort_export_${Date.now()}.zip"`,
        "Content-Type": "application/zip",
      },
    });

  } catch (err: any) {
    console.error("ZIP Error:", err);
    return NextResponse.json({ error: "Failed to create ZIP" }, { status: 500 });
  }
}