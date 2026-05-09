"use client"

import EmptyState from '@/components/EmptyState'
import PageSkeleton from '@/components/PageSkeleton'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { CurrentUserType, ListingType } from '@/lib/types'
import { useEffect, useState } from 'react'
import { getFavoriteListings } from '@/lib/getFavoriteListings'
import FavoriteClient from './FavoriteClient'

const FavoritesPage = () => {
    const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
    const [favorites, setFavorites] = useState<ListingType[]>([])
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
                const favs = await getFavoriteListings()

                setCurrentUser(user)
                setFavorites(favs)
            } catch {
            setError("Érreur du chargement de vos favoris. Veuillez réessayer")
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

    if (favorites.length === 0) {
        return <EmptyState title='Aucun favori trouvé' subtitle="Vous n'avez ajouter aucune annonce dans vos favoris" />
    }

    return (
        <FavoriteClient listings={favorites} currentUser={currentUser} />
    )
}

export default FavoritesPage