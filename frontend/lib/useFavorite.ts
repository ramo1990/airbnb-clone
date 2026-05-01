import { useCallback, useMemo } from 'react'
import useLoginModal from './useLoginModal'
import useAuthStore from './useAuthStore'
import { api } from './axios'
import { getCurrentUser } from './getCurrentUser'
import toast from 'react-hot-toast'


interface useFavoriteProps {
    listingId: string
}

const useFavorite = ({listingId}: useFavoriteProps) => {
    const loginModal = useLoginModal()
    const setUser = useAuthStore(state => state.setUser)
    const currentUser = useAuthStore(state => state.currentUser)

    const hasFavorited = useMemo(() => {
        const list = currentUser?.favoriteIds || []
        return list.includes(listingId)
    }, [currentUser, listingId])

    const toggleFavorite = useCallback(async () => {
        if (!currentUser) {
            return loginModal.onOpen()
        }

        try {
            let request
            if (hasFavorited) {
                request = () => api.delete(`/favorites/${listingId}/`)
            } else {
                request = () => api.post(`/favorites/${listingId}/`)
            }

            await request()

            const updatedUser = await getCurrentUser()
            if (updatedUser) {
                setUser(updatedUser)
            }
            toast.success(hasFavorited ? "Retiré de vos favoris" : "Ajouter à vos favoris")
        } catch (error) {
            const message = error instanceof Error ? `Echec de la mise à jour des favoris: ${error.message}` : "Échec de la mise à jour des favoris"
            toast.error(message)
        }
    }, [currentUser, hasFavorited, listingId, loginModal, setUser])

    return {
        hasFavorited, toggleFavorite
    }
}

export default useFavorite