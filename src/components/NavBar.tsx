'use client'
import React, { useEffect, useState } from 'react'
import { Music, User2, LogOut,Loader2,Search  } from 'lucide-react' // <-- Added User & LogOut icons
import createClient from '@/utils/supabase/client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // <-- Added useRouter
import { Song } from '@/type';
import { usePlayer } from '@/store/usePlayerStore';
import { User } from '@supabase/supabase-js';

function NavBar() {
    const [user, setUser] = useState<User | null>(null)
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const [isLoggingOut,setISLoggingOut] = useState(false)

    const [searchQuery,setSearchQuery] = useState('')
    const [searchResult,setSearchResult] = useState<Song[]>([])
    const [isSearching,setISSearching] = useState(false)

    const {playSong} = usePlayer()

    useEffect(() => {
        // Initial fetch
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        fetchUser()

        // Ye line ensure karegi ki jab aap login/logout karo toh navbar turant update ho bina refresh ke!
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null)
        })

        return () => subscription.unsubscribe()
    }, [])

    //Search Logic
    useEffect(()=>{
        
        if(!searchQuery.trim()){
            setSearchResult([])
            return
        }

        const delayDebounceFn = setTimeout(async()=>{

            setISSearching(true)

            //Searcing in the database where the title matches
        try {
            
                const [hindiRes,engRes] = await Promise.all([
           
                supabase.storage
                .from('melodyStream')
                .list('songs',{
                 limit:100
                }),

                supabase.storage
                .from('melodyStream')
                .list('eng songs',{
                 limit:5
                })
                
           ])

           const query = searchQuery.toLowerCase()

           const songs:Song[] = []

           const processFiles = (files:any | null,audioFolder:string,imageFolder:any)=>{

            if(!files)return
            for(const file of files){
                
                if(file.name === '.emptyFolderPlaceholder' || file.name === '') continue

               if(file.name.toLowerCase().includes(query)){
                 
                const songTitle = file.name.split('.')[0]

                 const {data:audioData} = supabase.storage
                                   .from('melodyStream')
                                   .getPublicUrl(`${audioFolder}/${file.name}`)

                const {data:imageData} = supabase.storage
                                   .from('melodyStream')
                                   .getPublicUrl(`${imageFolder}/${songTitle}.jpg`)

                songs.push({
                    id:file.id,
                    song_url:audioData.publicUrl,
                    image_url:imageData.publicUrl,
                    audio_path:`${audioFolder}/${file.name}`,
                    image_path:`${imageFolder}/${songTitle}`,
                    title:songTitle
                })

               }

               
            }
           }

           processFiles(hindiRes.data,'songs','song images')
           processFiles(engRes.data,'eng songs','eng song images')

           setSearchResult(songs.slice(0,5))

        } catch (error) {
            console.error('Error searching songs',error)
        }

            setISSearching(false)

        },400)

        return ()=> clearTimeout(delayDebounceFn)

    },[searchQuery])

    const handleLogout = async () => {

      setISLoggingOut(true)
        await supabase.auth.signOut()
        setUser(null)
        router.push('/')
        router.refresh()

    }

    if (pathname.startsWith('/login') || pathname.startsWith('/signup')) return null

    return (
        <div className='sticky top-0 z-50 flex items-center justify-between p-2.5 sm:p-4 bg-background/60 backdrop-blur-2xl border-b border-white/10 shadow-lg rounded-b-2xl mb-4 sm:mb-6 transition-all'>
            
            {/* Logo Section */}
            <Link href="/" className='flex items-center gap-2 group cursor-pointer shrink-0'>
                <div className='p-1.5 sm:p-2 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors'>
                    <Music size={22} className='text-primary sm:w-7 sm:h-7' />
                </div>
                <h1 className='text-xl sm:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-primary hidden sm:block'>
                    Melody<span className='text-white/60 font-medium'>Stream</span>
                </h1>
            </Link>
            {/* Middle Search Bar */}
            <div className="relative flex-1 max-w-md mx-2 sm:mx-4">
                <div className="relative group">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                    <input 
                        type="text"
                        placeholder="Search for songs..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 sm:py-2.5 pl-8 sm:pl-11 pr-3 sm:pr-4 text-xs sm:text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    {/* Floating Dropdown Results */}
                    {searchQuery.trim() && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto">
                            {isSearching ? (
                                <div className="flex items-center justify-center p-6">
                                    <Loader2 className="animate-spin text-primary" size={24} />
                                </div>
                            ) : searchResult.length > 0 ? (
                                <div className="flex flex-col p-1">
                                    {searchResult.map((song) => (
                                        <button
                                            key={song.id}
                                            onClick={() => {
                                                playSong(song);
                                                setSearchQuery(''); // Close dropdown after playing
                                            }}
                                            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl transition-colors text-left"
                                        >
                                            <img 
                                                src={song.image_url} 
                                                alt={song.title} 
                                                className="w-12 h-12 rounded-lg object-cover shadow-md" 
                                            />
                                            <span className="text-sm font-semibold text-white truncate">{song.title}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-sm text-white/50">
                                    No songs found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* Right Auth Section */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {user ? (
                    <div className="relative group">
                        <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer transition-colors border border-white/10 shadow-inner">
                            <User2 size={20} className="text-white/80 sm:w-5 sm:h-5" />
                        </div>
                        <div className={`absolute right-0 mt-3 w-48 transition-all duration-200 ease-in-out transform origin-top-right z-50 pt-1 ${
                            isLoggingOut ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
                        }`}>
                            <div className="p-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex flex-col gap-1">
                                
                                <span className="px-2 py-2 text-xs text-white/50 truncate border-b border-white/10 mb-1">
                                    {user.email}
                                </span>
                                
                                <button 
                                    onClick={handleLogout}
                                    disabled={isLoggingOut} 
                                    className="flex items-center gap-2 px-2 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Logging out...
                                        </>
                                    ) : (
                                        <>
                                            <LogOut size={16} />
                                            Log out
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <Link href="/login" className="text-muted-foreground hover:text-white font-semibold px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-base transition-colors hidden sm:block">
                            Log in
                        </Link>
                        <Link href="/signup" className="bg-primary hover:bg-primary/90 text-white font-bold px-3.5 py-1.5 sm:px-6 sm:py-2.5 text-xs sm:text-sm rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                            Sign up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NavBar
