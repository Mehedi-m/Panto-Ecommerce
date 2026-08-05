import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Session invalid or missing." }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("test");
    
    const userProfile = await db.collection("users").findOne({ _id: new ObjectId(session.user.id) });
    if (!userProfile) {
      return NextResponse.json({ error: "Account mapping node not found." }, { status: 404 });
    }

    // Never return the password block back to the UI layout layers
    const { password, ...sanitizedProfile } = userProfile;
    return NextResponse.json(sanitizedProfile, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 1. Authentication Guard
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Session modification write unauthorized." }, { status: 401 });
    }

    // 2. Format Guard: Ensure ID is a valid 24-character hex string for MongoDB
    if (!ObjectId.isValid(session.user.id)) {
      console.error("❌ NextAuth Session ID is not a valid MongoDB ObjectId:", session.user.id);
      return NextResponse.json({ 
        error: "Invalid account ID format. Try logging out and logging back in." 
      }, { status: 400 });
    }

    const body = await request.json();
    
    // Prevent client mutation over strict account unique tracking variables
    const { _id, email, password, createdAt, ...allowedPayload } = body;

    // 3. Payload Guard: MongoDB will crash if $set receives an empty object
    if (Object.keys(allowedPayload).length === 0) {
      return NextResponse.json({ error: "No modifiable fields were provided." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("test"); // Pass your explicit string like client.db("panto") if your URI lacks a default DB name

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: allowedPayload }
    );

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount }, { status: 200 });
  } catch (error) {
    // 🔥 This prints the exact stack trace to your terminal running Next.js
    console.error("💥 CRITICAL ERROR IN PUT /api/profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}