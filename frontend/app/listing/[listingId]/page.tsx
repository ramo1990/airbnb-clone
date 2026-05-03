"use client"

import { CurrentUserType, ListingType } from "@/lib/types"
import { use, useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { getListingById } from "@/lib/getListingById"
import Skeleton from "@/components/Skeleton"
import EmptyState from "@/components/EmptyState"
import ListingClient from "./ListingClient"


interface IParams {
    listingId: string
}

export default function ListingPage ({params}: {params: Promise<IParams>}) {
    const {listingId} = use(params)
    const [listing, setListing] = useState<ListingType | null>(null)
    const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(true)

        Promise.allSettled([
            getListingById(listingId),
            getCurrentUser()
        ])
        .then((results) => {
            const [listingResult, userResult] = results

            if (listingResult.status === "fulfilled") {
                setListing(listingResult.value)
                if (!listingResult.value) {
                    setError("Échec du chargement de l'annonce")
                }
            } else {
                setError("Échec du chargement de l'annonce")
            }

            if (userResult.status === "fulfilled") {
                setCurrentUser(userResult.value)
            }
        })
        .finally(() => setIsLoading(false))
    }, [listingId])

    if (isLoading) {
        return <Skeleton />
    }

    if (error) {
        return (
            <EmptyState title="Erreur" subtitle={error} />
    )} 

    if (!listing) {
        return (
            <EmptyState />
        )
    }

    return (
        <ListingClient listing={listing} currentUser={currentUser} />
    )
 }

