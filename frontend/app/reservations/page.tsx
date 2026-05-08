"use client"

import EmptyState from '@/components/EmptyState'
import PageSkeleton from '@/components/PageSkeleton'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { getHostReservations } from '@/lib/getreservations'
import { CurrentUserType, ReservationType } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import ReservationClient from './ReservationClient'

const ReservationPage = () => {
    const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
    const [hostReservations, setHostReservations] = useState<ReservationType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            const user = await getCurrentUser()
            if (!user) {
                setLoading(false)
                return
            }
            const host = await getHostReservations()

            setCurrentUser(user)
            setHostReservations(host)
            setLoading(false)
        }
        loadData()
    }, [])

    if (loading) return <PageSkeleton />

    if (!currentUser) {
        return <EmptyState title='Non autorisé' subtitle='Veuillez-vous connecter' />
    }

    if (hostReservations.length === 0) {
        return <EmptyState title='Aucune reservation trouvée' subtitle="Vous n'avez aucune réservation sur vos logements" />
    }

    return (
        <ReservationClient reservations={hostReservations} currentUser={currentUser} />
    )
}

export default ReservationPage