import {create} from "zustand"
import {Range} from "react-date-range"
import { CountrySelectValue } from "@/components/Inputs/CountrySelect"

interface SearchFiltersStore {
    location?: CountrySelectValue
    dates?: Range
    guests?: number

    setLocation: (loc: CountrySelectValue | undefined) => void 
    setDates: (range: Range | undefined) => void 
    setGuests: (count: number | undefined) => void 

    reset: () => void
}

const useSearchFilters = create<SearchFiltersStore>((set) => ({
    location: undefined,
    dates: undefined,
    guests: undefined,

    setLocation: (loc) => set({location: loc}),
    setDates: (range) => set({dates: range}),
    setGuests: (count) => set({guests: count}),

    reset: () => set({
        location: undefined,
        dates: undefined,
        guests: undefined,
    })
}))

export default useSearchFilters