"use client";

import "./globals.css";

import { AuthProvider } from "./Providers";

import { SessionProvider } from "next-auth/react";
import Layout from "./layoutaside";
export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <SessionProvider>
                    <AuthProvider>
                        <Layout>{children}</Layout>
                    </AuthProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
