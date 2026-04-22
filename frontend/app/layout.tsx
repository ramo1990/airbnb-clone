import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbars/Navbar";
import RegisterModal from "@/components/modals/RegisterModal";
import { Toaster } from "react-hot-toast";
import LoginModal from "@/components/modals/LoginModal";
import AuthProvider from "@/components/providers/AuthProvider";


const font = Nunito({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb location d'appartement",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html
      lang="fr"
      className={font.className}
    >
      <body className={font.className}>
        <AuthProvider>
          <Toaster />
          <RegisterModal />
          <LoginModal />
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
