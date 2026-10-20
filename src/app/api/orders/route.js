import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { formatOrderDocument } from "@/lib/order";

/**
 * GET /api/orders: Fetches orders matching the logged-in user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (!session.user?.email && !session.user?.id)) {
      return NextResponse.json({ error: "Unauthorized access node." }, { status: 401 });
    }

    const client = await clientPromise;
    const dbName = process.env.DB_NAME || "productDB";
    const db = client.db(dbName);

    const userEmail = session.user.email?.toLowerCase();
    const userId = session.user.id;

    // Search query matching by user email, shipping email, or userId
    const filterQuery = {
      $or: [
        ...(userEmail ? [{ userEmail }] : []),
        ...(userEmail ? [{ "shippingAddress.email": userEmail }] : []),
        ...(userId ? [{ userId }] : []),
      ],
    };

    let userOrders = await db
      .collection("orders")
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .toArray();

    // Fallback search in test database if no orders found in productDB
    if (userOrders.length === 0 && dbName !== "test") {
      try {
        const testDb = client.db("test");
        const testOrders = await testDb
          .collection("orders")
          .find(filterQuery)
          .sort({ createdAt: -1 })
          .toArray();
        if (testOrders.length > 0) {
          userOrders = testOrders;
        }
      } catch (e) {
        // Continue with empty array
      }
    }

    return NextResponse.json(userOrders, { status: 200 });
  } catch (error) {
    console.error("MongoDB order fetch failure:", error);
    return NextResponse.json({ error: "Failed to retrieve order logs." }, { status: 500 });
  }
}

/**
 * POST /api/orders: Stores the order from the checkout form into MongoDB
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const payload = await request.json();

    if (!payload || !payload.items || payload.items.length === 0) {
      return NextResponse.json({ error: "Order must contain at least one item." }, { status: 400 });
    }

    // Format order payload
    const formattedOrder = formatOrderDocument({
      ...payload,
      userId: payload.userId || session?.user?.id || null,
      userEmail: session?.user?.email?.toLowerCase() || payload.shippingAddress?.email?.toLowerCase() || null,
    });

    // Add backwards compatibility alias fields for profile display
    formattedOrder.paymentMethod = formattedOrder.payment.method;
    formattedOrder.total = formattedOrder.totals.grandTotal;

    const client = await clientPromise;
    const dbName = process.env.DB_NAME || "productDB";
    const db = client.db(dbName);

    const result = await db.collection("orders").insertOne(formattedOrder);

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