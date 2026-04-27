import React from 'react'
import { IconType } from 'react-icons'


interface CategoryInputProps {
    icon: IconType
    label: string
    description?: string
    selected: boolean
    onClick: (value: string) => void
}

const CategoryInput = ({icon: Icon, label, description, selected, onClick}: CategoryInputProps) => {
    return (
        <div
            onClick={() => onClick(label)}
            className={`rounded-xl border-2 p-4 flex flex-col gap-3 hover:border-black transition cursor-pointer text-neutral-900
                ${selected ? "border-black" : "border-neutral-200"}`}
        >
            <div className='flex flex-row items-center gap-3'>
                <Icon size={30} />
                <div className='font-semibold'> {label} </div>
            </div>

            {description && (
                <div className='text-sm text-neutral-500'> {description} </div>
            )}
        </div>
    )
}

export default CategoryInput