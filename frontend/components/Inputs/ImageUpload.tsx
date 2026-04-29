import {arrayMove, rectSortingStrategy, SortableContext, useSortable} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import Image from "next/image"
import { closestCenter, DndContext, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import {FiTrash} from "react-icons/fi"
import { useState } from "react"
import toast from "react-hot-toast"
import { TbPhotoPlus } from "react-icons/tb"

interface MultiImageUploadProps {
    value: string[]
    onChange: (urls: string[]) => void
}

function SortableImage({url, onRemove}: {url: string, onRemove: () => void}) {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: url})

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="relative group aspect-square touch-none" >
            <div {...listeners} className="cursor-grab active:cursor-grabbing h-full w-full touch-none relative">
                <Image 
                    src={url}
                    alt="uploaded"
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 300px"
                    quality={95}
                />
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    onRemove()
                }}
                className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded md:opacity-0 
                    md:group-hover:opacity-100 transition text-sm opacity-100"
            >
                <FiTrash size={18} />
            </button>
        </div>
    )
}

export default function MultiImageUpload({onChange, value}: MultiImageUploadProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 5
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 5
            }
        }),
    )

    const [isUploading, setIsUploading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (!files || files.length === 0) return

        if (value.length + files.length > 5) {
            toast.error("Vous ne pouvez pas ajouter plus de 5 images")
            return
        }

        setIsUploading(true)

        try {
            const newUrls: string[] = []
            for (const file of Array.from(files)) {
                if (value.length + newUrls.length >= 5) break

                const res = await fetch("/api/upload")
                if (!res.ok) {
                    throw new Error("Impossible de recuperer l'url")
                }

                const {url} = await res.json()
                const uploadRes = await fetch(url, {
                    method: "PUT",
                    body: file,
                    headers: {"Content-Type": file.type}
                })
                if (!uploadRes.ok) {
                    throw new Error("Impossible de charger les images")
                }

                const publicUrl = url.split("?")[0]
                newUrls.push(publicUrl)
            }

            onChange([...value, ...newUrls])
        } catch (error) {
            console.error("Erreur de chargement:", error)
            toast.error("Erreur lors du chargement des images. Veuillez réessayer")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event
        if (!over || active.id === over.id) return

        const oldIndex = value.indexOf(active.id as string)
        const newIndex = value.indexOf(over.id as string)

        onChange(arrayMove(value, oldIndex, newIndex))
    }


    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={value} strategy={rectSortingStrategy} >
                <div className="grid grid-cols-3 gap-4">
                    {isUploading && (
                        <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-md animate-pulse">
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-gray-500 mt-2"> Chargement en cours...</p>
                        </div>
                    )}

                    {!isUploading && value.length < 5 && (
                        <label 
                            className={`border-dashed border-2 p-10 flex flex-col items-center justify-center
                                cursor-pointer hover:opacity-70 text-neutral-950
                                ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                                ${value.length === 0 ? "col-span-3 mx-auto" : ""}`
                            }
                        >
                            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
                            <TbPhotoPlus size={40} />
                            <span>Ajouter</span>
                        </label>
                    )}

                    {value.map((url) => (
                        <SortableImage 
                            key={url}
                            url={url}
                            onRemove={() => onChange(value.filter((img) => img !== url))}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}