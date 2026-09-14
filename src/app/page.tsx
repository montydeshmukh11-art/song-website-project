import { Song } from "@/type";
import { createClient } from "@/utils/supabase/server";
import SongRow from "@/components/SongRow";
import Footer from "@/components/Footer";

async function fetchSongs (audioFolderName:string,imageFoldreName:string):Promise<Song[]>{

  const supabase = await createClient()

  const {data:audioFiles,error} = await supabase.storage
  .from('melodyStream')
  .list(audioFolderName)

  if(error){
    console.log(`Fetching problems fetching songs from ${audioFolderName}`,error)
    return[]
  }

   const songs:Song[] = []

   if(audioFiles){
    for(const file of audioFiles){
      if(file.name === '.emptyFolderPlaceholder' || file.name === '') continue

      const songTitle = file.name.split('.')[0]

      const {data:audioData} = supabase.storage
      .from('melodyStream')
      .getPublicUrl(`${audioFolderName}/${file.name}`)

      const {data:imageData} = supabase.storage
      .from('melodyStream')
      .getPublicUrl(`${imageFoldreName}/${songTitle}.jpg`)

      songs.push({
        id:file.id || file.name,
        title:songTitle,
        audio_path:`${audioFolderName}/${file.name}`,
        image_path:`${imageFoldreName}/${songTitle}`,
        song_url:audioData.publicUrl,
        image_url:imageData.publicUrl
      })

    }
   }

   return songs

}


export default async function Home() {  
  const englishSongs = await fetchSongs('eng songs','eng song images')
  
  const hindiSongs = await fetchSongs('songs','song images')
  
  const trendingSongs = [...hindiSongs.slice(0,10),...englishSongs.slice(0,10)].sort(()=>Math.random()-0.5)
  
  hindiSongs.sort(()=>Math.random()-0.5)
  
  englishSongs.sort(()=>Math.random()-0.5)

  return (
    <div className="flex min-h-screen flex-col">
     <main className="flex-1">
       <SongRow title="Trending Songs" songs={trendingSongs} />
      <SongRow title="Hindi Songs" songs={hindiSongs} />
      <SongRow title="English Songs" songs={englishSongs} />
     </main>
     <Footer/>
    </div>
  );
}