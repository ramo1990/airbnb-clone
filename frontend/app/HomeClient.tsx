"use client"

import Container from "@/components/Container"
import EmptyState from "@/components/EmptyState"
import ListingCard from "@/components/listings/ListingCard"
import Categories from "@/components/navbars/Category"
import { ListingType } from "@/lib/types"

interface Props {
    listings: ListingType[]
}

export default function HomeClient({listings}: Props) {

    return (
        <>
            <div className="mb-2">
                <Categories />
            </div>

            {listings.length === 0 && (
                <EmptyState showReset />
            )}

            {listings.length > 0 && (
                <Container>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                        {listings.map((listing: ListingType) => (
                            <ListingCard key={listing.id} data={listing} actionId={listing.id} />
                        ))}
                    </div>
                </Container>
            )}
        </>
    )
}