"use client"

import Container from '@/components/Container'
import Heading from '@/components/Heading'
import ListingCard from '@/components/listings/ListingCard'
import { api } from '@/lib/axios'
import { CurrentUserType, ListingType } from '@/lib/types'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

interface PropertiesClientProps {
    listings: ListingType[]
    currentUser: CurrentUserType | null
}

const PropertiesClient = ({listings, currentUser}: PropertiesClientProps) => {
    const [items, setItems] = useState(listings)
    const [deletingId, setDeletingId] = useState("")

    const onCancel = useCallback((id: string) => {
        setDeletingId(id)

        api.delete(`/listing/${id}/`)
        .then(() => {
            toast.success("Annonce supprimée")
            setItems((prev) => prev.filter((item) => item.id !== id))
        })
        .catch((error) => {
            if (error?.response?.status===403) {
                toast.error("Vous n'avez pas la permission de supprimer ce logement")
            } else {
                toast.error(error?.response?.data?.error || "Échec de la suppression du logement")
            }
        })
        .finally(() => {
            setDeletingId("")
        })
    }, [])

    return (
        <Container>
            <Heading title='Logements' subtitle='Listes de vos logements' />

            <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
                {items.map((listing) => (
                    <ListingCard 
                        key={listing.id}
                        data={listing}
                        actionId={listing.id}
                        onAction={onCancel}
                        disabled={deletingId === listing.id}
                        actionLabel='supprimer'
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    )
}

export default PropertiesClient