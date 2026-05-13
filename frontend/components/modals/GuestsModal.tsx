"use client"


import useSearchFilters from "@/lib/useSearchFilters"
import { useState } from "react"
import Modal from "./Modal"
import useGuestsModal from "@/lib/useGuestsModal"
import Counter from "../Inputs/Counter"


const GuestsModal = () => {
    const modal = useGuestsModal()
    const setGuests = useSearchFilters((s) => s.setGuests)

    const [guestCount, setGuestCount] = useState(1)

    const onSubmit = () => {
        setGuests(guestCount)
        modal.onClose()
    }

    return (
        <Modal 
            isOpen={modal.isOpen}
            onClose={modal.onClose}
            onSubmit={onSubmit}
            title="Voyageurs"
            actionLabel="Ajouter"
            body={
                <Counter 
                    title="Voyageurs"
                    subtitle="Combien de voyageurs êtes-vous ?"
                    value={guestCount}
                    onChange={setGuestCount}
                />
            }
        />
    )
}

export default GuestsModal