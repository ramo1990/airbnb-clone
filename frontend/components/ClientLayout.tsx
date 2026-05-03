"use client"

import { useCallback, useState } from "react"
import Navbar from "./navbars/Navbar"


export default function ClientLayout({children}: {children: React.ReactNode}) {
    const [navHeight, setNavHeight] = useState(0)

    const handleNavHeight = useCallback((height: number) => {
        setNavHeight(height)
    }, [])

    return (
        <>
            <Navbar onHeight={handleNavHeight} />
            <div style={{height: navHeight }} />
            <div className="pb-20">
                {children}
            </div>
        </>
    )
}