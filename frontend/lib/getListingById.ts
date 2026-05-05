import { api } from "./axios"
import { ListingType } from "./types"


export const getListingById = async (id: string): Promise<ListingType | null> => {
  try {
    const response = await api.get(`/listing/${id}/`)
    return response.data
  } catch (error) {
    console.error("Erreur lors de la recuperation des annonces:", error)
    return null
  }
}