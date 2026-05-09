"use client"

import EmptyState from '@/components/EmptyState'
import PageSkeleton from '@/components/PageSkeleton'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { CurrentUserType, ListingType } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import { getUserListings } from '@/lib/getUserListings'
import PropertiesClient from './PropertiesClient'

const PropertiesPage = () => {
    const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
    const [listings, setListings] = useState<ListingType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                const user = await getCurrentUser()
                if (!user) {
                    setLoading(false)
                    return
                }
                const res = await getUserListings()

                setCurrentUser(user)
                setListings(res)
            } catch {
                setError("Échec du chargement de vos logements. Veuillez réessayer")
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) return <PageSkeleton />

    if (error) {
        return (<EmptyState title='Erreur' subtitle={error} />)
    }

    if (!currentUser) {
        return <EmptyState title='Non autorisé' subtitle='Veuillez-vous connecter' />
    }

    if (listings.length === 0) {
        return <EmptyState title='Aucune logement trouvé' subtitle="Il semble que vous n'ayez aucun logement pour le moment"/>
    }

    return (
        <PropertiesClient listings={listings} currentUser={currentUser} />
    )
}

export default PropertiesPage