import {create} from 'zustand'
import { Song } from "@/type";

type RepeatMode = 'none' | 'one' | 'all'

interface PlayerStore {
    currentSong:Song | null
    queue:Song[]
    isPlaying:boolean
    volume:number
    isShuffled:boolean
    repeatMode:RepeatMode
    playSong:(song:Song,queue?:Song[])=>void
    playNext:()=>void
    playPrev:()=>void
    setIsPlaying:(isPlaying:boolean)=>void
    setVolume:(volume:number)=>void
    toggleShuffle:() =>void
    cycleRepeat:() =>void
}

export const usePlayer = create<PlayerStore>((set,get)=>({
    currentSong:null,
    queue:[],
    isPlaying:false,
    volume:1,
    isShuffled:false,
    repeatMode:'none',

    playSong:(song:Song,queue?:Song[])=>{
        set({
            currentSong:song,
            isPlaying:true,
            ...(queue && {queue})
        })
    },

    playNext:()=>{
        const {currentSong,queue,repeatMode,isShuffled} = get()

        if(!currentSong || queue.length === 0) return

        const currentIndex = queue.findIndex((s)=>s.id === currentSong.id)

        if(repeatMode === 'one'){
            set({isPlaying:true})
            return
        }
        
        if(currentIndex === -1) return

         let nextIndex:number

         if(isShuffled){
            
            do {
                nextIndex = Math.floor(Math.random()*queue.length)
            } while (nextIndex === currentIndex && queue.length > 1);

         }else{
            nextIndex = (currentIndex+1)%queue.length
         }

         set({
            currentSong:queue[nextIndex],
            isPlaying:true
         })
    },

    playPrev:()=>{
        const {currentSong,queue} = get()

        if(!currentSong || queue.length === 0) return
        const currentIndex = queue.findIndex((s)=>s.id === currentSong.id)
        
        if(currentIndex === -1) return

        const prevIndex = (currentIndex+queue.length-1)%queue.length

        set({
            currentSong:queue[prevIndex],
            isPlaying:true
        })

    },

    setIsPlaying:(isPlaying:boolean)=>{
        set({isPlaying})
    },

    setVolume:(volume:number)=>{
        set({volume})
    },

    toggleShuffle: ()=> {
        set((state)=>({
            isShuffled : !state.isShuffled
        }))
    },

     cycleRepeat: () => {

        set((state) => {
           const next:RepeatMode = 
           state.repeatMode === 'none' ? 'all' :
           state.repeatMode === 'all' ? 'one' : 'none'

           return {repeatMode : next}
        })

    }
}))