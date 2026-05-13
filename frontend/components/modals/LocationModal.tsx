"use client"

import useLocationModal from '@/lib/useLocationModal'
import useSearchFilters from '@/lib/useSearchFilters'
import { useState } from 'react'
import CountrySelect, { CountrySelectValue } from '../Inputs/CountrySelect'
import Modal from './Modal'

const LocationModal = () => {
    const modal = useLocationModal()
    const setLocation = useSearchFilters((s) => s.setLocation)
    const [location, setLocationLocal] = useState<CountrySelectValue | undefined>()
    
    const onSubmit = () => {
        setLocation(location)
        modal.onClose()
    }

    return (
        <Modal 
            isOpen={modal.isOpen}
            onClose={modal.onClose}
            onSubmit={onSubmit}
            title="Où voulez-vous aller ?"
            actionLabel="Ajouter"
            body={
                <CountrySelect value={location} onChange={(value) => setLocationLocal(value ?? undefined)} />
            }
        />
    )
}

export default LocationModal