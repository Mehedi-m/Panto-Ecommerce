import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("test");
        const { email, password } = credentials;

        const user = await db.collection("users").findOne({ email: email.toLowerCase() });
        if (!user) throw new Error("No user found with this email.");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Incorrect password.");

        return { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email,
          image: user.image || null
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  callbacks: {
    // Intercept OAuth sign-ins to write to MongoDB
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const client = await clientPromise;
        const db = client.db("test");
        
        const existingUser = await db.collection("users").findOne({ email: user.email.toLowerCase() });
        
        if (!existingUser) {
          await db.collection("users").insertOne({
            name: user.name,
            email: user.email.toLowerCase(),
            image: user.image, // Saves Google avatar picture URL
            createdAt: new Date(),
          });
        } else if (!existingUser.image && user.image) {
          // Optional fallback: Sync image if it wasn't saved before
          await db.collection("users").updateOne(
            { _id: existingUser._id },
            { $set: { image: user.image } }
          );
        }
      }
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      // 1. Handle initial login capture
      if (user) {
        token.id = user.id;
        token.image = user.image;
        token.name = user.name;
        token.email = user.email;
      }
      
      // 2. 🔥 THE ULTIMATE SESSION UPDATE COUPLING:
      // Catches both flat and deeply nested payload structures fired from client update() hooks
      if (trigger === "update" && session) {
        // Flat structures: update({ name: "..." })
        if (session.name) token.name = session.name;
        if (session.image) token.image = session.image;

        // Nested user structures: update({ user: { name: "..." } })
        if (session.user?.name) token.name = session.user.name;
        if (session.user?.image) token.image = session.user.image;
      }
      
      // 3. Google ID normalizer patch
      if (account?.provider === "google" || (token.email && (!token.id || token.id.length !== 24))) {
        const client = await clientPromise;
        const db = client.db("test");
        const dbUser = await db.collection("users").findOne({ email: token.email.toLowerCase() });
        if (dbUser) {
          token.id = dbUser._id.toString();
          
          // Fallback check to make sure token parameters are populated if missing
          if (!token.name && dbUser.name) token.name = dbUser.name;
          if (!token.image && dbUser.image) token.image = dbUser.image;
        }
      }
      
      return token;
    },

    // 🔄 Sync down token parameters straight into the active browser session state instance
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.image = token.image;
        session.user.name = token.name; 
        session.user.email = token.email;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };