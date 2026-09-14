'use client';

import createClient from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.refresh();
    };

    return (
        <button
            onClick={handleSignOut}
            className="text-sm font-semibold text-white/70 hover:text-white bg-white/5 border border-white/10 px-4 py-1.5 rounded-full hover:bg-white/10 transition-all"
        >
            Log out
        </button>
    );
}
