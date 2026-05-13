"use client"

import useMobileSearchModal from "@/lib/useMobileSearchModal"
import useSearchFilters from "@/lib/useSearchFilters"
import { formatISO } from "date-fns"
import { useRouter } from "next/navigation"
import qs from "query-string"
import React, { useState } from "react"
import {Range} from "react-date-range"
import CountrySelect, { CountrySelectValue } from "../Inputs/CountrySelect"
import Calendar from "../Inputs/Calendar"
import Counter from "../Inputs/Counter"
import Modal from "./Modal"


enum STEPS {
    LOCATION = 0,
    DATE = 1,
    GUESTS = 2
}

const MobileSearchModal = () => {
    const modal = useMobileSearchModal()
    const {setLocation, setDates, setGuests} = useSearchFilters()
    const router = useRouter()

    const [step, setStep] = useState(STEPS.LOCATION)
    const [location, setLocationLocal] = useState<CountrySelectValue | undefined>()

    const [dates, setDatesLocal] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection"
    })

    const [guestCount, setGuestCount] = useState(1)

    const onNext = () => setStep((s) => s + 1)
    const OnBack = () => setStep((s) => s - 1)

    const applyFilters = () => {
        const updatedQuery: Record<string, string | number | undefined> = {}
        const start = dates.startDate
        let end = dates.endDate

        if (start && end && start.getTime() === end.getTime()) {
            const nextDay = new Date(start)
            nextDay.setDate(nextDay.getDate() + 1)
            end = nextDay
        } 

        if (location) updatedQuery.locationValue = location.value
        if (start) updatedQuery.startDate = formatISO(start)
        if (end) updatedQuery.endDate = formatISO(end)
        if (guestCount) updatedQuery.guestCount = guestCount

        console.log("[Mobile] Filtres envoyés:" , updatedQuery)

        const url = qs.stringifyUrl({url: "/", query: updatedQuery})

        router.push(url)
    }

    const onSubmit = () => {
        if (step !== STEPS.GUESTS) return onNext()

        const start = dates.startDate
        let end = dates.endDate

        if (start && end && start.getTime() === end.getTime()) {
            const nextDay = new Date(start)
            nextDay.setDate(nextDay.getDate() + 1)
            end = nextDay
        } 

        setLocation(location)
        setDates({startDate: start, endDate: end, key: "selection"})
        setGuests(guestCount)

        applyFilters()

        modal.onClose()
    }

    let body: React.ReactElement | undefined = undefined

    if (step === STEPS.LOCATION) {
        body = (
            <CountrySelect 
                value={location}
                onChange={(v) => setLocationLocal(v ?? undefined)}
            />
        )
    }

    if (step === STEPS.DATE) {
        body = (
            <Calendar 
                value={dates}
                onChange={(v) => setDatesLocal(v.selection)}
            />
        )
    }

    if (step === STEPS.GUESTS) {
        body = (
            <Counter 
                title="Voyageurs"
                subtitle="Nombre de voyageurs"
                value={guestCount}
                onChange={setGuestCount}
            />
        )
    }

    return (
        <Modal 
            isOpen={modal.isOpen}
            onClose={modal.onClose}
            onSubmit={onSubmit}
            title="Recherche"
            actionLabel={step === STEPS.GUESTS ? "Rechercher" : "Suivant"}
            secondaryAction={step === STEPS.LOCATION ? undefined : OnBack}
            secondaryActionLabel={step === STEPS.LOCATION ? undefined : "Retour"}
            body={body}
        />
    )
}

export default MobileSearchModal