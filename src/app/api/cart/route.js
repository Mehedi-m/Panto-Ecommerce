import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: Retrieve user cart from MongoDB
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access token missing" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    const cart = await db.collection("carts").findOne({ userId });
    return NextResponse.json(cart ? cart.items : []);
  } catch (error) {
    console.error("MongoDB GET Error:", error);
    return NextResponse.json({ error: "Internal Database Failure" }, { status: 500 });
  }
}

// POST: Sync/Update user cart items inside MongoDB
export async function POST(request) {
  try {
    const { userId, items } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access token missing" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Upsert configuration: Updates existing array or creates new document profile if missing
    await db.collection("carts").updateOne(
      { userId },
      { $set: { items, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MongoDB POST Error:", error);
    return NextResponse.json({ error: "Internal Database Failure" }, { status: 500 });
  }
}