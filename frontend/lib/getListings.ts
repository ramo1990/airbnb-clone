import { ListingType } from './types'
import { apiServer } from './axiosServer'

export const getListings = async (): Promise<ListingType[] | null> => {
    
    try {
        const res = await apiServer.get("/listing")
        return res.data
    } catch (error) {
        console.error("Erreur lors de la recupération des des annonces", error)
        return null
    }
}
