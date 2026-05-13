import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import RegisterModal from "@/components/modals/RegisterModal";
import { Toaster } from "react-hot-toast";
import LoginModal from "@/components/modals/LoginModal";
import Provider from "@/components/providers/Provider";
import RentModal from "@/components/modals/RentModal";
import ClientLayout from "@/components/ClientLayout";
import LocationModal from "@/components/modals/LocationModal";
import DateModal from "@/components/modals/DateModal";
import GuestsModal from "@/components/modals/GuestsModal";
import MobileSearchModal from "@/components/modals/MobileSearchModal";


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
          <LocationModal />
          <DateModal />
          <GuestsModal />
          <MobileSearchModal />
          <ClientLayout>
            {children}
          </ClientLayout>
        </Provider>
      </body>
    </html>
  );
}
