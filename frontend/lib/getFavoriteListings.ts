import { api } from "./axios";
import { ListingType } from "./types";


export async function getFavoriteListings(): Promise<ListingType[]> {
    try {
        const response = await api.get("/favorites/")
        return response.data
    } catch (error) {
        console.error("erreur lors de récupération des annonces favorites:", error)
        throw error
    }
}