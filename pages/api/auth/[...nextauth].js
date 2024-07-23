import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/connectDB";

if (!process.env.NEXTAUTH_SECRET)
    throw ("You need to provide NEXTAUTH_secret.")

const authOptions = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            id: "credentials",
            credentials: {
                email: {
                    label: "E-mail",
                    type: "email",
                    placeholder: "email@example.com",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials, req) {
                if (!credentials || !credentials.email || !credentials.password) {
                    return null;
                }
                try {
                    await connectDB();
                    const user = await User.findOne({
                        email: credentials.email,
                    });

                    if (user) {
                        const isMatch = await bcrypt.compare(
                            credentials.password,
                            user.password,
                        );
                        if (isMatch) {
                            return user;
                        } else {
                            throw new Error("Check your credentials!");
                        }
                    } else {
                        throw new Error("User not found!");
                    }
                } catch (err) {
                    console.error(err);
                    throw new Error("Internal server error");
                }
            },
        }),
    ],
    pages: {
        signIn: "/",
        newUser: "/",
        error: "/",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = {
                    _id: user._id,
                    email: user.email,
                };
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = token.user;
            }
            return session;
        },
    },
});

export default authOptions;