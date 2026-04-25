"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import AuthProvider from "./AuthProvider"
import GoogleSync from "./GoogleSync"

export default function Providers({children}: {children: React.ReactNode}) {
    return (
        <SessionProvider>
            <AuthProvider>
                <Toaster />
                <GoogleSync />
                {children}
            </AuthProvider>
        </SessionProvider>
    )
}