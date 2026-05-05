"use client"

import { getCountries } from "@/lib/getCountries"
import { CurrentUserType } from "@/lib/types"
import { useState } from "react"
import Heading from "../Heading"
import Image from "next/image"
import HeartButton from "../HeartButton"
import ImageCarouselModal from "../modals/ImageCarouselModal"


interface ListingHeadProps {
    title: string
    locationValue: string
    city?: string | null
    images: string[]
    id: string
    currentUser: CurrentUserType | null
}

const ListingHead = ({title, locationValue, city, images, id, currentUser}: ListingHeadProps) => {
    const {getByValue} = getCountries()
    const location = getByValue(locationValue)

    const subtitleParts = [
        city, 
        location?.label,
        location?.region
    ].filter(Boolean)

    const [isGalleryOpen, setIsGalleryOpen] = useState(false)

    return (
        <>
            <Heading title={title} subtitle={subtitleParts.join(", ")} /> 

            {images.length === 1 && (
                <div
                    onClick={() => setIsGalleryOpen(true)}
                    className="w-full h-[60vh] overflow-hidden rounded-xl relative cursor-pointer"
                >
                    <Image 
                        src={images[0]} 
                        alt="Image principale" 
                        fill 
                        className="object-cover rounded-xl" 
                        loading="eager"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute top-5 right-5">
                        <HeartButton listingId={id} currentUser={currentUser} />
                    </div>
                </div>
            )}

            {images.length > 1 && (
                <div
                    className="w-full h-[60vh] overflow-hidden rounded-xl relative grid grid-cols-4 grid-rows-2 gap-2"
                >
                    <div 
                        className="col-span-2 row-span-2 relative cursor-pointer"
                        onClick={() => setIsGalleryOpen(true)}
                    >
                        <Image 
                            src={images[0]} 
                            alt="Image principale" 
                            fill 
                            className="object-cover rounded-xl" 
                            loading="eager"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute top-5 right-5 z-20">
                            <HeartButton listingId={id} currentUser={currentUser} />
                        </div>
                    </div>

                    {images.slice(1, 5).map((img, index) => (
                        <div 
                            key={index} 
                            className="relative cursor-pointer" 
                            onClick={() => setIsGalleryOpen(true)} 
                        >
                            <Image 
                                alt={`Image ${index +2}`}
                                src={img}
                                fill 
                                className="object-cover rounded-xl"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                        </div>
                    ))}
                </div>
            )}

            <ImageCarouselModal 
                images={images}
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
            />
        </>
    )
}

export default ListingHead