import { api } from "./axios";
import { ReservationType } from "./types";

export async function getReservationsByListing(listingId: string): Promise<ReservationType[]> {
    try {
        const response = await api.get(`/reservations/listing/${listingId}/`)
        return response.data
    } catch (error) {
        console.error("Erreur lors de la recuperation des réservations:", error)
        return []
    }
} 