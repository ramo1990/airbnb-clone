import { BiSearch } from 'react-icons/bi'


const Search = () => {
    return (
        <div className='border border-gray-300 w-full md:w-auto py-2 rounded-full shadow-sm transition cursor-pointer'>
            <div className='flex flex-row items-center justify-between'>

                <div className='text-sm font-semibold px-4 sm:px-6'>
                    Destination
                </div>

                <div className='hidden sm:flex text-sm font-semibold px-6 border-x flex-1 justify-center'>
                    Quand ?
                </div>

                <div className='flex flex-row items-center text-gray-600 pl-4 pr-2 gap-3'>
                    <div className='hidden sm:block'> Voyageurs </div>
                    <div className='p-2 bg-rose-500 rounded-full text-white hover:bg-rose-600 transition'> <BiSearch size={18} /> </div>
                </div>

            </div>
        </div>
    )
}

export default Search