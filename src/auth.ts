import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            name: user.name || "Google User",
            email: user.email,
            password: "",
            role: "USER",
            avatar: user.image || "",
            isEmailVerified: true,
            emailOtp: "",
            emailOtpExpires: null,
          });
        }

        return true;
      } catch (error) {
        console.error("Google signIn error:", error);
        return false;
      }
    },
  },
});
