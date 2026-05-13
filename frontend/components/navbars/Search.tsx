"use client"

import { getCountries } from "@/lib/getCountries"
import useIsMobile from "@/lib/isMobile"
import useDateModal from "@/lib/useDateModal"
import useGuestsModal from "@/lib/useGuestsModal"
import useLocationModal from "@/lib/useLocationModal"
import useMobileSearchModal from "@/lib/useMobileSearchModal"
import useSearchFilters from "@/lib/useSearchFilters"
import { differenceInDays, formatISO } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"
import { ParsedQuery } from "query-string"
import { BiSearch } from 'react-icons/bi'


const Search = () => {
    const router = useRouter()
    const params = useSearchParams()

    const isMobile = useIsMobile()
    const mobileModal = useMobileSearchModal()

    const locationModal = useLocationModal()
    const dateModal = useDateModal()
    const guestsModal = useGuestsModal()
    const {location, dates, guests} = useSearchFilters()

    const applyFilters = () => {
        const currentQuery = params ? qs.parse(params.toString()) : {}
        const updatedQuery: ParsedQuery<string> = {...currentQuery}

        if (location) updatedQuery.locationValue = location.value
        if (dates?.startDate) updatedQuery.startDate = formatISO(dates.startDate)
        if (dates?.endDate) updatedQuery.endDate = formatISO(dates.endDate)
        if (guests) updatedQuery.guestCount = guests.toString()

        console.log("Filtres envoyés:" , updatedQuery)

        const url = qs.stringifyUrl({url: "/", query: updatedQuery})

        router.push(url)
    }

    const locationLabel = location 
        ? getCountries().getByValue(location.value)?.label
        : "Destination"

    const durationLabel = dates?.startDate && dates?.endDate
        ? (() => {
            let diff = differenceInDays(dates.endDate!, dates.startDate!)
            if (diff === 0) diff = 1
            return `${diff} ${diff === 1 ? "Jour" : "Jours"}`
        })()
        : "Quand ?"

    const guestLabel = guests 
        ? `${guests} ${guests === 1 ? "Voyageur" : "Voyageurs"}`
        : "Voyageurs"

    return (
        <div className='border border-gray-300 w-full md:w-auto py-2 rounded-full shadow-sm transition cursor-pointer'>
            <div className='flex flex-row items-center justify-between'>

                <div 
                    onClick={(e) => {
                        e.stopPropagation()
                        if (isMobile) {
                            mobileModal.onOpen()
                        } else {
                            locationModal.onOpen()
                        }
                    }}
                    className='text-sm font-semibold px-4 sm:px-6'
                >
                    {locationLabel}
                </div>

                <div 
                    onClick={(e) => {
                        e.stopPropagation()
                        if (isMobile) {
                            mobileModal.onOpen()
                        } else {
                            dateModal.onOpen()
                        }
                    }}
                    className='hidden sm:flex text-sm font-semibold px-6 border-x flex-1 justify-center'
                >
                    {durationLabel}
                </div>

                <div className='flex flex-row items-center text-gray-600 pl-4 pr-2 gap-3'>
                    <div 
                        onClick={(e) => {
                            e.stopPropagation()
                            if (isMobile) {
                                mobileModal.onOpen()
                            } else {
                                guestsModal.onOpen()
                            }
                        }}
                        className='hidden sm:block'
                    > 
                        {guestLabel} 
                    </div>
                    <div 
                        onClick={(e) => {
                            e.stopPropagation()
                            if (isMobile) {
                                mobileModal.onOpen()
                            } else {
                                applyFilters()
                            }
                        }}
                        className='p-2 bg-rose-500 rounded-full text-white hover:bg-rose-600 transition'
                    > 
                        <BiSearch size={18} /> 
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Search