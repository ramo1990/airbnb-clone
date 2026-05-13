import {create} from 'zustand'


interface GuestsModalStore {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

const useGuestsModal = create<GuestsModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))

export default useGuestsModal