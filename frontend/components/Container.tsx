import React from 'react'


interface ContainerProps {
    children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({children}) => {
    return (
        <div className='w-full mx-auto xl:px-20 md:px-10 sm:px-6 px-4 text-neutral-950'>
            {children}
        </div>
    )
}

export default Container