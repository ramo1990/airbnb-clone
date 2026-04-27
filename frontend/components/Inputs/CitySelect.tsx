"use client"

import Select from "react-select"


export interface CitySelectValue {
    name: string
    latlng: [number, number]

}

interface CitySelectProps {
    cities: CitySelectValue[]
    value?: CitySelectValue | null
    onChange: (city: CitySelectValue | null) => void
}

interface CityOption {
    label: string
    value: CitySelectValue
}

const CitySelect = ({cities, value, onChange}: CitySelectProps) => {
    
    const options: CityOption[] = cities.map((city) => ({
        label: city.name,
        value: city
    }))

    return (
        <Select 
            placeholder='Selectionner une ville'
            isClearable
            options={options}
            value={value ? {label: value.name, value}: null}
            onChange={(option: CityOption | null) => onChange(option?.value ?? null)}
        />
    )
}

export default CitySelect