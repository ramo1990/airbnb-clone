"use client"

import { MenuIcon } from 'lucide-react'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import Avatar from './Avatar'
import MenuItem from './MenuItem'
import useRegisterModal from '@/lib/useRegisterModal'


const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const registerModal = useRegisterModal()

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, [])

    useEffect (() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return() => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className='relative' ref={menuRef}>
            <div className='flex flex-row items-center gap-3'>

                <div 
                    onClick={() => {}}
                    className='hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-200 transition cursor-pointer'
                >
                    Hôte
                </div>

                <div 
                    onClick={toggleOpen}
                    className='px-4 md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center gap-3 rounded-full
                        cursor-pointer hover:shadow-md transition'
                >
                    <MenuIcon className='w-9 h-9 md:h-5 md:w-5' />
                    <div className='hidden md:block'> <Avatar /> </div>
                </div>
            </div>

            {isOpen && (
                <div className='absolute rounded-xl shadow-md w-[80vw] sm:w-[60vw] md:w-[40vw] lg:[25vw] bg-white overflow-hidden right-0 top-12 text-sm'>
                    <div className='flex flex-col cursor-pointer'>
                        <MenuItem onClick={() => {}} label='Se connecter'/>
                        <MenuItem onClick={registerModal.onOpen} label="S'inscrire"/>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu