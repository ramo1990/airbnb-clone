import { CurrentUserType } from './types'
import { create } from 'zustand'
import { getCurrentUser } from './getCurrentUser'


interface AuthStoreProps {
    currentUser: CurrentUserType | null 
    setUser: (user: CurrentUserType | null) => void
    logout: () => void
    loadUser: () => Promise<void>
}

const useAuthStore = create<AuthStoreProps>((set) => ({
    currentUser: null,
    setUser: (user) => set({currentUser: user}),

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
        }
        set({currentUser: null})
    },

    loadUser: async () => {
        try {
            const user = await getCurrentUser()
            set ({currentUser: user})
        } catch (error) {
            set ({currentUser: null})
            throw error
        }
    }
})) 


export default useAuthStore