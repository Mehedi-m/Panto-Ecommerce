import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    // 1. Await the native MongoDB client connection promise
    const client = await clientPromise;

    const db = client.db(process.env.DB_NAME);

    // 3. Query your "testimonials" collection and stream documents into an array
    const data = await db
      .collection("reviews")
      .find({})
      .toArray();

    // 4. Return the database payload as a verified JSON response stream
    return Response.json(data);
  } catch (error) {
    // Catch connection timeouts or authentication failures safely
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}