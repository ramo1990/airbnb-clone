import Image from 'next/image'


interface AvatarProps {
  src: string | null | undefined
}

const Avatar = ({src}: AvatarProps) => {
  const validSrc = src && (src.startsWith("http") || src.startsWith("/")) ? src : "/user.png"
  return (
    <Image 
        alt="Avatar"
        src={validSrc}
        height={30}
        width={30}
        className='rounded-full'
    />
  )
}

export default Avatar