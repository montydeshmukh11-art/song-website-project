'use client'
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/store/usePlayerStore";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Repeat1 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function GlobalPlayer() {
    const pathname = usePathname();

    const {
        currentSong,
        isPlaying,
        playNext,
        playPrev,
        playSong,
        queue,
        setIsPlaying,
        setVolume,
        volume,
        cycleRepeat,
        isShuffled,
        repeatMode,
        toggleShuffle
    } = usePlayer()

    const audioRef = useRef<HTMLAudioElement>(null)

    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)

    //For Play/Pause Handling
    useEffect(() => {

        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play()
                    .catch(err => console.log('Playback error', err))
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying, currentSong])

    const handleEnded = () => {
        if (repeatMode === 'one' && audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play()
        }
        playNext()
    }

    //When website is loaded for the fisrt time loads the volume of stored in localStorage

    useEffect(() => {
        const savedVolume = localStorage.getItem('volume')
        if (savedVolume !== null) {
            setVolume(Number(savedVolume))
        }
    }, [setVolume])

    //Volume handling when the volume changes it gets stored in the websites localStorage

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
            localStorage.setItem('volume', volume.toString())
        }
    }, [volume])

    //Keyboard commands handler
    useEffect(()=>{

        const handleKeyDown = (e:KeyboardEvent)=>{
            const tag = (e.target as HTMLElement).tagName
           //If typing in search area then do noting
            if(tag ==='INPUT' || tag === 'TEXTAREA')return

            switch (e.key) {
                case ' ': e.preventDefault()
                 if(currentSong) setIsPlaying(!isPlaying)
                    break;

                 case 'ArrowUp' : e.preventDefault()
                 setVolume(Math.min(1,volume+0.1))
                 break

                 case 'ArrowDown' : e.preventDefault()
                 setVolume(Math.max(0,volume-0.1))
                 break

                 case 'ArrowRight' : e.preventDefault()
                 playNext()
                 break

                 case 'ArrowLeft' : e.preventDefault()
                 playPrev()
                 break
            
                 case 'm':
                 case 'M':
                    e.preventDefault()
                    toggleMute()
                    break

            }

        }

        window.addEventListener('keydown',handleKeyDown)
        return ()=>window.removeEventListener('keydown', handleKeyDown)

    },[isPlaying,currentSong,volume,playNext, playPrev, setIsPlaying, setVolume])

    const toggleMute = () => {
        if (volume === 0) setVolume(1)
        else setVolume(0)
    }

    const togglePlay = () => {
        if (!currentSong) return
        setIsPlaying(!isPlaying)
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime)
            setDuration(audioRef.current.duration)
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value)
        if (audioRef.current) {
            audioRef.current.currentTime = time
            setProgress(time)
        }
    }

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)

        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    // Agar user login page par hai, toh player ko hide kar do
    if (!currentSong || pathname.startsWith('/login') || pathname.startsWith('/signup')) return null;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 h-16 sm:h-24 bg-player/85 backdrop-blur-2xl border-t border-white/10 px-3 sm:px-6 flex items-center justify-between z-50 shadow-[0_-15px_40px_-10px_rgba(0,0,0,0.5)] transition-all"
        >
            {/* Mobile Top Edge Scrubber (Spotify-style progress line at top of player) */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 sm:hidden cursor-pointer">
                <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={progress}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <div 
                    className="h-full bg-primary transition-all duration-100" 
                    style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                />
            </div>

            <audio
                ref={audioRef}
                src={currentSong.song_url}
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onError={() => {
                    console.error('Failed to load :', currentSong.song_url)
                    setTimeout(() => playNext(), 1500)//if audio error play next song after 1.5 seconds
                }}
            />

            {/* Left: Gaane ki detail aur animated photo */}
            <div className="flex items-center flex-1 sm:flex-initial sm:w-1/4 min-w-0 sm:min-w-[200px] group mr-2 sm:mr-0">
                {/* Vinyl Record Style Image Container */}
                <div className={`relative overflow-hidden rounded-full w-10 h-10 sm:w-14 sm:h-14 mr-2.5 sm:mr-4 shrink-0 border-2 border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                    {currentSong.image_url ? (
                        <img
                            src={currentSong.image_url}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-card"></div>
                    )}
                    {/* Vinyl ka beech wala chhed (hole) */}
                    <div className="absolute inset-0 m-auto w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black rounded-full border border-white/20"></div>
                </div>

                <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-foreground hover:underline cursor-pointer tracking-wide drop-shadow-md truncate">
                        {currentSong.title}
                    </span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground hover:text-white/80 cursor-pointer transition truncate">
                        Unknown Artist
                    </span>
                </div>
            </div>

            {/* Center: Controls & Progress */}
            <div className="flex flex-col items-center shrink-0 sm:flex-1 sm:w-2/4 sm:max-w-[700px]">
                <div className="flex items-center gap-1.5 sm:gap-4 sm:mb-2">

                    <button
                        onClick={toggleShuffle}
                        className={`hidden sm:block p-2 rounded-full transition-all ${isShuffled ? 'text-primary' : 'text-muted-foreground hover:text-white'} hover:bg-white/10`}
                        title="Shuffle"
                    >
                        <Shuffle size={18} />
                    </button>

                    <button
                        onClick={playPrev}
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-all"
                        title="Previous"
                    >
                        <SkipBack size={18} className="sm:w-5 sm:h-5" fill="currentColor" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" className="sm:w-5 sm:h-5" /> : <Play size={18} fill="currentColor" className="ml-0.5 sm:w-5 sm:h-5" />}
                    </button>

                    <button
                        onClick={playNext}
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-all"
                        title="Next"
                    >
                        <SkipForward size={18} className="sm:w-5 sm:h-5" fill="currentColor" />
                    </button>

                    <button
                        onClick={cycleRepeat}
                        title={`Repeat: ${repeatMode}`}
                        className={`hidden sm:block p-2 rounded-full transition-all ${repeatMode !== 'none' ? 'text-primary' : 'text-muted-foreground hover:text-white'} hover:bg-white/10`}
                    >
                        {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
                    </button>

                </div>

                {/* Modern Seekbar for Desktop (with timestamps) */}
                <div className="hidden sm:flex items-center w-full gap-3 text-xs text-muted-foreground font-medium">
                    <span className="w-10 text-right">{formatTime(progress)}</span>
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-white transition-all outline-none"
                    />
                    <span className="w-10 text-left">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Volume (Desktop) */}
            <div className="hidden sm:flex items-center justify-end w-1/4 min-w-[150px] text-muted-foreground group">
                {/* Volume Button */}
                <button
                    onClick={toggleMute}
                    className="p-2 hover:text-white hover:bg-white/10 rounded-full transition-all z-10"
                >
                    {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                {/* Volume Bar (Jo hover karne par slide hokar bahar aayega) */}
                <div className="w-0 opacity-0 overflow-hidden group-hover:w-24 group-hover:opacity-100 group-hover:ml-2 transition-all duration-500 ease-in-out flex items-center">
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white hover:accent-primary transition-all outline-none"
                    />
                </div>
            </div>
        </div>
    )
}