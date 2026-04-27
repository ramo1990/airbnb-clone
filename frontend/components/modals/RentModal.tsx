"use client"

import useRentModal from '@/lib/useRentModal'
import React, { useMemo, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Heading from '../Heading'
import { categoryItems } from '../navbars/Category'
import CategoryInput from '../Inputs/CategoryInput'
import Modal from './Modal'
import dynamic from 'next/dynamic'
import CountrySelect from '../Inputs/CountrySelect'
import { citiesByCountry } from '@/lib/cities'
import CitySelect from '../Inputs/CitySelect'
import { haversineDistance } from '@/lib/distance'
import { findCountryFromCoords } from '@/lib/findCountry'


enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2, 
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const rentModal = useRentModal()
    const [step, setStep] = useState(STEPS.CATEGORY)

    const LocationMap = useMemo(() => dynamic(() => import("../Map"), {ssr: false}), [])

    const {setValue, watch} = useForm<FieldValues>({
        defaultValues: {
            category: "",
            location: null,
            city: null
        }
    })
   
    // eslint-disable-next-line react-hooks/incompatible-library
    const category = watch("category")
    const location = watch("location")
    const city = watch("city")

    const countryCode = location?.value 

    const cities = useMemo(() => {
        return countryCode ? citiesByCountry[countryCode] || [] : []
    }, [countryCode])

    const findClosestCity = (coords: [number, number], list: {name: string; latlng: [number, number]} []) => {
        if (!list || list.length === 0) return null

        let closest = null
        let minDistance = Infinity

        for (const c of list) {
            const dist = haversineDistance(coords, c.latlng)
            if (dist < minDistance) {
                minDistance = dist
                closest = c
            }
        }
        return closest
    }

    const handleMapClick = (coords: [number, number]) => {
        const [lat, lng] = coords
        const detectedCountry = findCountryFromCoords(lat, lng)

        if (detectedCountry) {
            setCustomValue("location", detectedCountry)
            const countryCities = citiesByCountry[detectedCountry.value] || []
            const closestCity = findClosestCity(coords, countryCities)

            if (closestCity) {
                setCustomValue("city", closestCity)
            }
        } else {
            setCustomValue("location", {
                ...(location || {}),
                latlng: coords,
            })
        }
    }

    const center = useMemo(() => {
        if (!location) return undefined
        const countryCities = citiesByCountry[location.value] || []
        const isCityValid = countryCities.some(c => c.name === city?.name)
        return isCityValid ? city?.latlng : location.latlng
    }, [location, city])

    const nearbyCities = useMemo(() => {
        if (!location?.latlng) return []
        const countryCities = citiesByCountry[location.value] || []
        return countryCities.map(city => ({
            name: city.name,
            latlng: city.latlng,
            distance: haversineDistance(location.latlng, city.latlng)
        }))
        .sort((a, b) => a.distance - b.distance).slice(0, 5)
    }, [location])

    const setCustomValue = <T,>(id: string, value: T) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }

    const onNext = () => {
        setStep((value) => value < STEPS.PRICE ? value + 1 : value)
    } 

    const onBack = () => {
        setStep((value) => value > STEPS.CATEGORY ? value - 1 : value)
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return "Créer"
        }
        return "Suivant"
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined
        }
        return "Retour"
    }, [step])

    let bodyContent = (
        <div>
            <Heading 
                title="Lequel décrit le mieux votre logement ?" subtitle='Choississez une categorie'
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-auto'>
                {categoryItems.map((item) => (
                    <div key={item.label} className='col-span-1'>
                        <CategoryInput
                            onClick={() => setCustomValue("category", item.label)}
                            selected= {category === item.label}
                            label= {item.label}
                            description={item.description}
                            icon= {item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading title='Où se situe votre logement ?' subtitle='Aidez les voyageurs à vous trouver' />

                <div className='relative z-20 text-neutral-950'>
                    <CountrySelect 
                        value={location}
                        onChange={(value) => {
                            setCustomValue("city", null)
                            setCustomValue('location', value)
                        }}
                    />
                </div>

                <div className='relative z-15 text-neutral-900'>
                    {cities.length > 0 && (
                        <CitySelect 
                            cities={cities}
                            value={city}
                            onChange={(value) => {setCustomValue("city", value)}}
                        />
                    )}
                </div>

                <div className='relative z-10'>
                    <LocationMap 
                        center= {center}
                        onClickMap={handleMapClick}
                        nearbyCities={nearbyCities}
                    />
                </div>

            </div>
        )
    }

    return (
        <Modal 
            isOpen= {rentModal.isOpen}
            onClose= {rentModal.onClose}
            onSubmit={onNext}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title='Devenir hôte'
            body={bodyContent}
        />
    )
}

export default RentModal