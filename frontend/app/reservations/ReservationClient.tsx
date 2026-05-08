"use client"

import Container from '@/components/Container'
import Heading from '@/components/Heading'
import ListingCard from '@/components/listings/ListingCard'
import { api } from '@/lib/axios'
import { CurrentUserType, ReservationType } from '@/lib/types'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

interface ReservationClientProps {
    reservations: ReservationType[]
    currentUser: CurrentUserType | null
}

const ReservationClient = ({reservations, currentUser}: ReservationClientProps) => {
    const [items, setItems] = useState(reservations)
    const [deletingId, setDeletingId] = useState("")

    const onCancel = useCallback((id: string) => {
        setDeletingId(id)

        api.delete(`/reservations/${id}/`)
        .then(() => {
            toast.success("Réservation annulée")
            setItems((prev) => prev.filter((item) => item.id !== id))
        })
        .catch((error) => {
            toast.error(error?.response?.data?.error || "Echec lors de l'annulation de la reservation")
        })
        .finally(() => {
            setDeletingId("")
        })
    }, [])

    return (
        <Container>
            <Heading title='Reservations' subtitle='Reservations sur vos logements' />

            <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
                {items.map((reservation) => (
                    <ListingCard 
                        key={reservation.id}
                        data={reservation.listing}
                        reservation={reservation}
                        actionId={reservation.id}
                        onAction={onCancel}
                        disabled={deletingId === reservation.id}
                        actionLabel='Annuler'
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    )
}

export default ReservationClient