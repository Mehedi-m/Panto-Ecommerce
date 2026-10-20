import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // Native check for existing users
    const userExists = await db.collection("users").findOne({ email: normalizedEmail });
    if (userExists) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Native insertion array document
    await db.collection("users").insertOne({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } catch (error) {
    console.error("Signup error details:", error);
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
  }
}