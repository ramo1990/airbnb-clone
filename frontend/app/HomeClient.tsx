"use client"

import Container from "@/components/Container"
import EmptyState from "@/components/EmptyState"
import ListingCard from "@/components/listings/ListingCard"
import Categories from "@/components/navbars/Category"
import { ListingType } from "@/lib/types"
import useAuthStore from "@/lib/useAuthStore"
import { useSearchParams } from "next/navigation"

interface Props {
    listings: ListingType[]
}

export default function HomeClient({listings}: Props) {
    const currentUser = useAuthStore(state => state.currentUser)
    const params = useSearchParams()
    const category = params?.get("category")

    const filteredListings = category
        ? listings.filter((listing) => listing.categories.includes(category))
        : listings

    return (
        <>
            <div className="mb-2">
                <Categories />
            </div>

            {filteredListings.length === 0 && (
                <EmptyState showReset />
            )}

            {filteredListings.length > 0 && (
                <Container>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                        {filteredListings.map((listing: ListingType) => (
                            <ListingCard key={listing.id} data={listing} actionId={listing.id} currentUser={currentUser} />
                        ))}
                    </div>
                </Container>
            )}
        </>
    )
}