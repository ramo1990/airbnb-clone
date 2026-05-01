"use client"

import { useRouter } from 'next/navigation'
import React from 'react'
import Heading from './Heading'
import { Button } from './ui/button'


interface EmptyStateProps {
    title?: string
    subtitle?: string
    showReset?: boolean
}

const EmptyState = ({title= "Aucune correspondance exacte", subtitle="Essayer de modifier ou de supprimer certains de vos filtres", showReset}: EmptyStateProps) => {
    const router = useRouter()
    
    return (
        <div className='h-[60vh] flex flex-col gap-2 justify-center items-center'>
            <Heading center title={title} subtitle={subtitle} />
            {showReset && (
                <Button 
                    variant="outline" 
                    label='Supprimer tous les filtres' 
                    className='w-auto px-6 cursor-pointer hover:bg-neutral-200 ' 
                    onClick={() => router.push("/")}
                />
            )}
        </div>
    )
}

export default EmptyState