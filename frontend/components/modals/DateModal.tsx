"use client"


import useDateModal from "@/lib/useDateModal"
import useSearchFilters from "@/lib/useSearchFilters"
import { useState } from "react"
import {Range} from "react-date-range"
import Modal from "./Modal"
import Calendar from "../Inputs/Calendar"


const DateModal = () => {
    const modal = useDateModal()
    const setDates = useSearchFilters((s) => s.setDates)

    const [range, setRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection"
    })

    const onSubmit = () => {
        setDates(range)
        modal.onClose()
    }

    return (
        <Modal 
            isOpen={modal.isOpen}
            onClose={modal.onClose}
            onSubmit={onSubmit}
            title="Sélectionnez vos dates"
            actionLabel="Ajouter"
            body={
                <Calendar 
                    value={range}
                    onChange={(value) => setRange(value.selection)}
                />
            }
        />
    )
}

export default DateModal