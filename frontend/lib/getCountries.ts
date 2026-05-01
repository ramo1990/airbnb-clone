import countries from 'world-countries'

const formattedCountries = countries.map((country) => ({
    value: country.cca2,
    label: country.translations.fra.common || country.name.common,
    flag: country.flag,
    latlng: country.latlng,
    region: country.region
}))

export const getAllCountries = () => formattedCountries
export const getCountryByValue = (value: string) => formattedCountries.find(c => c.value === value)

export const getCountries = () => ({
    getAll: getAllCountries,
    getByValue: getCountryByValue
})