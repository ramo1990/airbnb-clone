"use client"

import Container from '@/components/Container'
import ListingHead from '@/components/listings/ListingHead'
import ListingInfo from '@/components/listings/ListingInfo'
import { categoryItems } from '@/components/navbars/Category'
import { getCountries } from '@/lib/getCountries'
import { CurrentUserType, ListingType } from '@/lib/types'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const ListingMap = dynamic(() => import("@/components/Map"), {ssr: false})

interface ListingClientProps {
    listing: ListingType
    currentUser: CurrentUserType | null
}

const ListingClient = ({listing, currentUser}: ListingClientProps) => {
    const {getByValue} = getCountries()
    const country = getByValue(listing.country_code)
    let coordinates: [number, number]

    if (listing.city_lat && listing.city_lng) {
        coordinates = [listing.city_lat, listing.city_lng]
    } else if (country?.latlng) {
        coordinates = [country.latlng[0], country.latlng[1]]
    } else {
        coordinates = [0, 0]
    }

    const category = useMemo(() => {
        return categoryItems.find((item) => listing.categories.includes(item.label))
    }, [listing.categories])

    return (
       <Container>
            <div className='max-w-5xl mx-auto'>
                <div className='flex flex-col gap-6'>
                    <ListingHead 
                        title={listing.title}
                        images={listing.images}
                        locationValue={listing.country_code}
                        city={listing.city_name}
                        id={listing.id}
                        currentUser={currentUser}
                    />

                    <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
                        <div className='col-span-4'>
                            <ListingInfo 
                                user= {listing.owner}
                                category={category}
                                description={listing.description}
                                roomCount={listing.room_count}
                                guestCount={listing.guest_count}
                                bathroomCount={listing.bathroom_count}
                            />
                        </div>
                    </div>

                    <div className='w-full h-100 mt-10'>
                        <ListingMap center={coordinates} />
                    </div>
                </div>
            </div>
       </Container>
    )
}

export default ListingClient