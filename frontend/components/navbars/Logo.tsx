"use client"

import {useRouter} from "next/navigation"
import Image from "next/image"


const Logo = () => {
    const router = useRouter()

    return (
        <Image 
            alt="Logo"
            src="/logo.png"
            width={200}
            height={200}
            className="cursor-pointer object-contain w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
            priority
            onClick={() => router.push("/")}
        />
    )
}

export default Logo