"use client"


import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'


interface ImageCarouselModalProps {
    images: string[]
    isOpen: boolean
    onClose: () => void
}

export default function ImageCarouselModal({images, isOpen, onClose}: ImageCarouselModalProps) {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden"
        else document.body.style.overflow = "auto"
    }, [isOpen])

    const next = useCallback(() => {
        setIndex((i) => (i + 1) % images.length)
    }, [images.length])

    const prev = useCallback(() => {
        setIndex((i) => (i - 1 + images.length) % images.length)
    }, [images.length])

    const startX = useRef(0)
    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        const endX = e.changedTouches[0].clientX
        if (startX.current - endX > 50) next()
        if (endX - startX.current > 50) prev()
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 bg-black/90 z-999 flex flex-col'>

            <div className='flex justify-between items-center p-4 text-white'>
                <div className='text-sm opacity-80'>
                    {index + 1} / {images.length}
                </div>
                <button className='p-2 hover:opacity-70' onClick={onClose}>
                    <X size={28} />
                </button>
            </div>

            <div 
                className='flex-1 relative flex items-center justify-center'
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <Image 
                    src={images[index]} 
                    alt='Photo' 
                    fill 
                    className='object-contain' 
                    sizes='100vw'
                    loading={index === 0 ? "eager" : "lazy"}
                    priority={index === 0}
                />
                <button 
                    onClick={prev}
                    className='absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full text-white'
                >
                    <ChevronLeft size={32}/>
                </button>

                <button 
                    onClick={next}
                    className='absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full text-white'
                >
                    <ChevronRight size={32}/>
                </button>
            </div>
        </div>
    )
}
