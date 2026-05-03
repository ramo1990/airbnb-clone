import React, { useEffect, useRef } from 'react'
import Logo from './Logo'
import Container from '../Container'
import Search from './Search'
import UserMenu from './UserMenu'


interface NavbarProps {
    onHeight: (height: number) => void
}

const Navbar = ({onHeight}: NavbarProps) => {
    const navRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const updateHeight = () => {
            if (navRef.current) {
                onHeight(navRef.current.offsetHeight)
            }
        }

        updateHeight()

        window.addEventListener("resize", updateHeight)
        return () => window.removeEventListener("resize", updateHeight)
    }, [onHeight])

    return (
        <div 
            ref = {navRef}
            className='fixed w-full bg-white z-10 shadow-sm'
        >
            <div className='py-4 md:border-b'>
                <Container>
                    <div className='flex items-center justify-between gap-3 md:gap-0'>

                        <div className='flex-1 md:flex-none flex justify-start md:justify-normal'>
                            <Logo />
                        </div>

                        <div className='hidden md:block'>
                            <Search />
                        </div>

                        <div className='flex-1 md:flex-none flex justify-end'>
                            <UserMenu />
                        </div>
                    </div>
                </Container>
            </div>

            <div className='md:hidden px-4 pb-3 text-neutral-950'>
                <Search />
            </div>
        </div>
    )
}

export default Navbar