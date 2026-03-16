import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider !== "google") return true;

        await connectDB();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            name: user.name || "Google User",
            email: user.email,
            role: "USER",
            avatar: user.image || "",
            isEmailVerified: true,
            emailOtp: "",
            emailOtpExpires: null,
            provider: "google",
          });
        } else {
          if (!existingUser.avatar && user.image) {
            existingUser.avatar = user.image;
          }

          existingUser.isEmailVerified = true;

          if (!existingUser.provider) {
            existingUser.provider = "google";
          }

          await existingUser.save();
        }

        return true;
      } catch (error) {
        console.error("Google signIn error:", error);
        return false;
      }
    },

    async jwt({ token }) {
      if (!token.email) return token;

      await connectDB();
      const dbUser = await User.findOne({ email: token.email });

      if (dbUser) {
        token.userId = dbUser._id.toString();
        token.role = dbUser.role;
        token.name = dbUser.name;
        token.picture = dbUser.avatar || token.picture;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as "USER" | "ADMIN";
        session.user.name = token.name as string;
        session.user.image = (token.picture as string) || session.user.image;
      }

      return session;
    },
  },
});
