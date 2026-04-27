import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbars/Navbar";
import RegisterModal from "@/components/modals/RegisterModal";
import { Toaster } from "react-hot-toast";
import LoginModal from "@/components/modals/LoginModal";
import Provider from "@/components/providers/Provider";
import RentModal from "@/components/modals/RentModal";


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
        <Provider>
          <Toaster />
          <RegisterModal />
          <LoginModal />
          <RentModal />
          <Navbar />
          <div className="pt-36 md:pt-28 pb-20">
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
