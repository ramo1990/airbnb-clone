import Image from 'next/image'


interface AvatarProps {
  src: string | null | undefined
}

const Avatar = ({src}: AvatarProps) => {
  return (
    <Image 
        alt="Avatar"
        src={src || "/user.png"}
        height={30}
        width={30}
        className='rounded-full'
    />
  )
}

export default Avatar