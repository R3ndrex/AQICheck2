import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongodb";
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},

            async authorize(credentials) {
                const { email, password } = credentials;
                console.log("Authorize called with:", email);
                try {
                    await connectToDB();
                    const user = await User.findOne({ email });

                    if (!user) {
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (!passwordsMatch) {
                        console.error("Password does not match");
                        return null;
                    }
                    console.error("User authorized:", user.email);
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                    };
                } catch (error) {
                    console.log("Error: ", error);
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        },
    },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
