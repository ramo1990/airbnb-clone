import Image from 'next/image'


const Avatar = () => {
  return (
    <Image 
        alt="Avatar"
        src="/user.png"
        height={30}
        width={30}
        className='rounded-full'
    />
  )
}

export default Avatar