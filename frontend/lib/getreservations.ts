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

export async function getUserReservations(): Promise<ReservationType[]> {
    try {
        const response = await api.get(`/reservations/me/`)
        return response.data
    } catch (error) {
        console.error("Erreur lors de la recuperation des réservations de l'utilisateur:", error)
        return []
    }
} 

