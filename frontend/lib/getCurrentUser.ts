import { CurrentUserType } from './types'
import { api } from './axios'
import { AxiosError } from 'axios'

export const getCurrentUser = async (): Promise<CurrentUserType | null> => {
    if (typeof window === "undefined") return null

    const access = localStorage.getItem("access")
    if (!access) return null

    try {
        const response = await api.get("/me/")
        return response.data
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response?.status !== 401) {
                console.error("Erreur lors de la récupération de l'utilisateur:", error)
            } 
        } else {
            console.log("Erreur inconue", error)
        }
        throw error
    }
}

