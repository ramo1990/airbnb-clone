import { CurrentUserType } from '@/lib/types'
import useFavorite from '@/lib/useFavorite'
import React from 'react'
import toast from 'react-hot-toast'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'


interface HeartButtonProps {
    listingId: string
    currentUser: CurrentUserType | null
    onToggle?: () => void
}

const HeartButton = ({listingId, currentUser, onToggle}: HeartButtonProps) => {
    const {hasFavorited, toggleFavorite} = useFavorite({listingId})

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!currentUser) {
            toast.error("Vous devez être connecté pour ajouter un appartement comme favori")
            return
        }
        await toggleFavorite()
        onToggle?.()
    }

    return (
        <div 
            onClick={handleClick}
            className='relative hover:opacity-80 transition cursor-pointer'
        >
            <AiOutlineHeart size={28} className='fill-white absolute -top-0.5 -right-0.5' />

            <AiFillHeart size={24} className={hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"} />

        </div>
    )
}

export default HeartButton