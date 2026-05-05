"use client"

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import {MapContainer, useMapEvents, TileLayer, Marker, useMap, Popup} from 'react-leaflet'


delete (L.Icon.Default.prototype as unknown as {_getIconUrl?: unknown})._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

function ClickHandler({onClick}: {onClick: (coords: [number, number]) => void}) {
    useMapEvents({
        click(e) {
            onClick([e.latlng.lat, e.latlng.lng])
        }
    })
    return null
}

interface MapProps {
    center?: [number, number]
    onClickMap?: (coords: [number, number]) => void
    nearbyCities?: {name: string, latlng: [number, number], distance: number} []
}

function RecenterMap({center}: {center: [number, number]}) {
    const map = useMap()
    useEffect(() => {
        if (center) {
            map.setView(center, 6)
        }
    }, [center, map])

    return null
}

const LocationMap = ({center, onClickMap, nearbyCities}: MapProps) => {
    return (
        <MapContainer
            // key={center ? center.toString() : "default"}
            center={(center ?? [51, -0.09]) as L.LatLngExpression}
            zoom={center ? 6: 2}
            scrollWheelZoom={false}
            className='h-[35vh] rounded-lg'
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {onClickMap && <ClickHandler onClick={onClickMap} />}

            {center && <RecenterMap center={center} />}

            {center && (
                <Marker 
                    key={`${center[0]}-${center[1]}`}
                    position={center as L.LatLngExpression} 
                />
            )}

            {nearbyCities?.map((city, index) => (
                <Marker key={index} position={city.latlng as L.LatLngExpression} >
                    <Popup>
                        {city.name} - {city.distance.toFixed(1)} km
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    )
}

export default LocationMap