import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "@components/Navigation";
import MobileNavigationToggle from "@components/MobileNavigationToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Star Wars",
    description: "Star Wars characters, places and vehicles",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <MobileNavigationToggle>
                    <Navigation />
                </MobileNavigationToggle>
                <main>{children}</main>
            </body>
        </html>
    );
}
