"use client"

import React from 'react'
import { FaHome, FaHotel } from 'react-icons/fa'
import { MdApartment, MdAutoAwesome, MdDirectionsBoat, MdOutlineMeetingRoom, MdOutlineVilla, MdStairs } from 'react-icons/md'
import Container from '../Container'
import CategoryBox from '../modals/CategoryBox'
import { usePathname, useSearchParams } from 'next/navigation'
import { TbBeach, TbBuildingWarehouse, TbMountain } from 'react-icons/tb'
import { GiBoatFishing, GiCactus, GiCaveEntrance, GiHouse, GiIsland, GiWoodCabin } from 'react-icons/gi'
import { IoDiamond } from 'react-icons/io5'


export const categoryItems = [
    {label: "Appartement", icon: MdApartment, description: "Ce logement se situe dans un immeuble"},
    {label: "Maison", icon: FaHome, description: "Un logement individuel indépendant"},
    {label: "Studio", icon: MdOutlineMeetingRoom, description: "Un petit logement avec une seule pièce principale"},
    {label: "Loft", icon: TbBuildingWarehouse, description: "Un grand espace ouvert avec un style individuel"},
    {label: "Duplex", icon: MdStairs, description: "Ce logement est reparti sur deux étages"},
    {label: "Villa", icon: MdOutlineVilla, description: "Une grande maison luxueuse"},
    {label: "Chalet", icon: GiWoodCabin, description: "ce logement en bois se situe près en montagne"},
    {label: "Littoral", icon: TbBeach, description: "Ce logement se situe pres de la mer"},
    {label: "Lac", icon: GiBoatFishing, description: "Ce logement se situe près d'un lac"},
    {label: "île", icon: GiIsland, description: "ce logement se situe sur une île"},
    {label: "MiniMaison", icon: GiHouse, description: "Une tres petite maison optimisée"},
    {label: "Grotte", icon: GiCaveEntrance, description: "Ce logement aménagé se situe dans une grotte"},
    {label: "Flottant", icon: MdDirectionsBoat, description: "Ce logement se situe sur l'eau"},
    {label: "Hôtel", icon: FaHotel, description: "Un établissement proposant des chambres à louer"},
    {label: "Moderne", icon: MdAutoAwesome, description: "Ce logement est moderne"},
    {label: "Luxe", icon: IoDiamond, description: "Ce logement est luxueux"},
    {label: "Désert", icon: GiCactus, description: "Ce logement se situe dans le desert"},
    {label: "Campagne", icon: TbMountain, description: "Ce logement est à la campagne"},

]

const Categories = () => {
    const params = useSearchParams()
    const category = params?.get('category')
    const pathname = usePathname()
    const isMainPage = pathname === "/"

    if (!isMainPage) return null

    return (
        <Container>
            <div className='pt-4 flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide'>
                {categoryItems.map((item) => (
                    <CategoryBox 
                        key={item.label}
                        label={item.label}
                        selected={category === item.label}
                        icon={item.icon}
                    />
                ))}
            </div>
        </Container>
    )
}

export default Categories