'use client'

import { useRef } from "react"
import { Song } from "@/type"
import SongCard from "./SongCard"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SongRowProps {
    title: string
    songs: Song[]
}

export default function SongRow({ songs, title }: SongRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    if (songs.length === 0) return null

    // Scroll karne ka function
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            // Kitna aage peeche jana hai (300px per click)
            const scrollAmount = direction === 'left' ? -300 : 300; 
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    return (
        <div className="flex flex-col mb-6 sm:mb-8 relative group/row">
            
            {/* Title & Navigation Buttons Container */}
            <div className="flex items-center justify-between px-3 sm:px-4 mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{title}</h2>
                
                {/* Left & Right Arrow Buttons (Jab mouse le jaoge tabhi dikhenge) */}
                <div className="flex gap-2 transition-opacity duration-300 hidden md:flex">
                    <button 
                        onClick={() => scroll('left')} 
                        className="p-2 bg-card hover:bg-white/10 rounded-full transition-all hover:scale-105 text-muted-foreground hover:text-white"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={() => scroll('right')} 
                        className="p-2 bg-card hover:bg-white/10 rounded-full transition-all hover:scale-105 text-muted-foreground hover:text-white"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
            
            {/* Gaano ki list wali line jisme se scrollbar hide kar diya gaya hai */}
            <div 
                ref={scrollRef}
                className="flex overflow-x-auto pb-4 pt-2 px-3 sm:px-4 gap-3 sm:gap-6 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {songs.map((song) => (
                    <SongCard key={song.id} song={song} queue={songs} />   
                ))}
            </div>
            
        </div>
    )
}
