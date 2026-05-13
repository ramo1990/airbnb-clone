import {create} from 'zustand'


interface LocationModalStore {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

const useLocationModal = create<LocationModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))

export default useLocationModal