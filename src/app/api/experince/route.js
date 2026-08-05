import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db(process.env.DB_NAME);

    const data = await db
      .collection("products")
      .find({})
      .toArray();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}