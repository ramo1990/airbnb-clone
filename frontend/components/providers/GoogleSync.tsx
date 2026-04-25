"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { api } from "@/lib/axios"
import useAuthStore from "@/lib/useAuthStore"

export default function GoogleSync() {
    const {data: session} = useSession()
    const loadUser = useAuthStore((s) => s.loadUser)
    const [synced, setSynced] = useState(false)

    useEffect(() => {
        const syncUser = async () => {
            if (session?.user && !synced) {
                try {
                    setSynced(true)
                    const res = await api.post("/auth/google/", {
                        email: session.user.email,
                        name: session.user.name,
                        image: session.user.image
                    })

                    const {access, refresh } = res.data
                    localStorage.setItem("access", access)
                    localStorage.setItem("refresh", refresh)
                    await loadUser()
                } catch (err) {
                    console.error("Erreur sync Google:", err)
                    setSynced(false)
                }
            }
        }
        syncUser()
    }, [session?.user, session?.user?.image, session?.user?.name, loadUser, synced])

    return null
}