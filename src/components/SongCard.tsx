'use client'
import { usePlayer } from "@/store/usePlayerStore";
import { Song } from "@/type";
import { Play, Pause } from "lucide-react";


interface SongCardProps {
    song: Song
    queue: Song[]
}

export default function SongCard({ song, queue }: SongCardProps) {

    const { currentSong, isPlaying, playSong } = usePlayer()

    const isCurrentSong = currentSong?.id === song?.id

    const handlePlay = () => {
        playSong(song, queue)
    }

    return (
        <div
            onClick={handlePlay}
            className="group relative flex flex-col p-2.5 sm:p-3 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 min-w-[135px] max-w-[150px] sm:min-w-[180px] sm:max-w-[200px] snap-start shrink-0 hover:-translate-y-1"
        >
            <div className="relative w-full aspect-square mb-2.5 sm:mb-4 shadow-lg rounded-xl overflow-hidden bg-player">
                {song.image_url ? (
                    <img
                        src={song.image_url}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300'}
                    />
                ) : (
                    <img
                        src='https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300'
                        alt={song.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                )}
                <button
                    className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 sm:w-12 sm:h-12 bg-primary hover:bg-primary/90 hover:scale-110 rounded-full flex items-center justify-center text-primary-foreground shadow-[0_4px_20px_rgba(139,92,246,0.5)] transition-all duration-300
    ${isCurrentSong && isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'}
    `}
                >
                    {isCurrentSong && isPlaying
                        ? <Pause fill="currentColor" size={15} className="sm:w-5 sm:h-5" />
                        : <Play fill="currentColor" size={16} className="ml-0.5 sm:w-5 sm:h-5" />
                    }
                </button>

            </div>

            <h3 className="font-semibold text-xs sm:text-[15px] truncate text-foreground group-hover:text-primary transition-colors px-1">{song.title}</h3>
        </div>
    )

}