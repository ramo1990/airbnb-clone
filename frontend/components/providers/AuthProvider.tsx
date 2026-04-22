"use client"

import { api } from "@/lib/axios"
import useAuthStore from "@/lib/useAuthStore"
import { useEffect } from "react"

export default function AuthProvider({children}: {children: React.ReactNode}) {
    const loadUser = useAuthStore((s) => s.loadUser)
    const logout = useAuthStore((s) => s.logout)

    useEffect(() => {
        const run = async () => {
            if (typeof window === "undefined") return

            const access = localStorage.getItem("access")
            const refresh = localStorage.getItem("refresh")

            if (!access && !refresh) {
                logout()
                return
            }

            if (access) {
                try {
                    await loadUser()
                    return
                } catch (err: unknown) {
                    if (err instanceof Error && "response" in err) {
                        const axiosErr = err as {response?: {status?: number}}
                        if (axiosErr.response?.status === 401) {
                            localStorage.removeItem("access")
                        } else {
                            return
                        }
                    }
                }
            }

            if (refresh) {
                try {
                    const res = await api.post("/token/refresh/", {refresh})
                    const newAccess = res.data.access

                    localStorage.setItem("access", newAccess)
                    await loadUser()
                    return
                } catch {
                    logout()
                    return
                }
            }

            logout()
        }

        run()
    }, [loadUser, logout])

    return <>{children}</>
}

