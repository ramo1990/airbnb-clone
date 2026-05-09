"use client"


import { getCountries } from '@/lib/getCountries'
import { CurrentUserType, ListingType, ReservationType } from '@/lib/types'
import React, { useCallback, useMemo } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import HeartButton from '../HeartButton'
import { useRouter } from 'next/navigation'
import { format } from "date-fns"
import { fr } from "date-fns/locale"


interface ListingCardProps {
    data: ListingType
    onAction?: (id: string) => void
    disabled?: boolean
    actionLabel?: string
    actionId?: string
    currentUser: CurrentUserType | null
    onFavoriteToggle?: (id: string) => void
    reservation?: ReservationType
}

const ListingCard = ({data, onAction, disabled, actionLabel, actionId, currentUser, onFavoriteToggle, reservation}: ListingCardProps) => {
    const {getByValue} = getCountries()
    const location = getByValue(data.country_code)
    const router = useRouter()

    const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (disabled || !actionId) {
            return
        }
        onAction?.(actionId)
    }, [onAction, actionId, disabled])

    const locationLabel = data.city_name
        ? `${data.city_name}, ${location?.label}`
        : `${location?.label}, ${location?.region}`

    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice
        }
        return data.price
    }, [reservation, data.price])

    const reservationDate = useMemo(() => {
        if (!reservation) {
            return null
        }
        const start = new Date(reservation.startDate)
        const end = new Date(reservation.endDate)

        return `${format(start, "PP", {locale: fr})} - ${format(end, "PP", {locale: fr})}`
    }, [reservation])

    return (
        <div 
            onClick={() => router.push(`/listing/${data.id}/`)}
            className='col-span-1 cursor-pointer group'
        >
            <div className='flex flex-col gap-2 w-full'>
                <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
                    <Image 
                        fill
                        alt="listing"
                        src={data.images[0]}
                        className='object-cover group-hover:scale-110 transition'
                        sizes='
                            (max-width: 640px) 100vw,
                            (max-width: 1024px) 50vw,
                            (max-width: 1280px) 33vw,
                            25vw
                        '
                        loading="eager"
                    />

                    <div className='absolute top-3 right-3'>
                        <HeartButton listingId={data.id} currentUser={currentUser} onToggle={() => onFavoriteToggle?.(data.id)} />
                    </div>
                </div>

                <div className='font-semibold text-lg'>
                    {locationLabel}
                </div>

                <div className='font-light text-neutral-500'>
                    {reservationDate || data.categories}
                </div>

                <div className='flex flex-row items-center gap-1'>
                    <div className='font-semibold'>
                        {price} $
                    </div>
                    {!reservation && (
                        <div className='font-light'>par nuit</div>
                    )}
                </div>

                {onAction && actionLabel && (
                    <Button disabled={disabled} size="sm" label={actionLabel} onClick={handleCancel} />
                )}
            </div>
        </div>
    )
}

export default ListingCard