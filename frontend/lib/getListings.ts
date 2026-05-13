import { ListingType, ListingQueryParams } from './types'
import { apiServer } from './axiosServer'

export const getListings = async (params?: ListingQueryParams): Promise<ListingType[] | null> => {
    
    try {
        const res = await apiServer.get("/listing", {params})
        return res.data
    } catch (error) {
        console.error("Erreur lors de la recupération des des annonces", error)
        return null
    }
}
