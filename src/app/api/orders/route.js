import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise from "@/lib/mongodb";

/**
 * 1. GET HANDLER: Fetches orders matching the logged-in user
 * Route: GET /api/orders
 */
export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized access node." }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Finds all orders where the user's email matches perfectly
    const userOrders = await db
      .collection("orders")
      .find({ userEmail: session.user.email }) 
      .sort({ createdAt: -1 }) // Newest orders first
      .toArray();

    return NextResponse.json(userOrders, { status: 200 });
  } catch (error) {
    console.error("MongoDB order fetch failure:", error);
    return NextResponse.json({ error: "Failed to retrieve order logs." }, { status: 500 });
  }
}

/**
 * 2. POST HANDLER: Stores the order from your checkout form into MongoDB
 * Route: POST /api/orders
 */
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    // Optional: Require an active session to place an order, or allow guest checkouts
    const userEmail = session?.user?.email || null;

    const payload = await request.json();

    // Map your frontend payload cleanly to the native MongoDB schema layout
    const finalOrderDocument = {
      userEmail: userEmail, // 🔑 The golden key linking this order to their profile
      items: payload.items.map(item => ({
        name: item.name,
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price) || 0,
      })),
      totals: {
        grandTotal: parseFloat(payload.totalAmount) || 0,
      },
      payment: {
        method: payload.paymentMethod || "COD",
        status: "Pending",
      },
      status: "Processing",
      createdAt: new Date(), // Native ISODate timestamp
    };

    const client = await clientPromise;
    const db = client.db();

    // Commit straight into the collections matrix
    const result = await db.collection("orders").insertOne(finalOrderDocument);

    return NextResponse.json(
      {
        success: true,
        message: "Order successfully committed to database records.",
        orderId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MongoDB write pipeline failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}