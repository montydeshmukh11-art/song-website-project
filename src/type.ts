export interface Song {
    title:string
    id:string
    image_path:string
    audio_path:string
    user_id?:string

    //Below urls will come from supabase
    image_url:string
    song_url:string
}