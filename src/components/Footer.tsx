import {Music} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-10">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-8 sm:gap-10 sm:flex-row sm:justify-between">

          {/* Brand + about */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
               <Music size={24} className='text-primary sm:w-7 sm:h-7' />
              <span className="text-base sm:text-lg font-medium text-zinc-200">MelodyStream</span>
            </div>

            <p className="mt-3 leading-relaxed text-zinc-500 text-sm sm:text-base">
              A practice project built while learning full-stack development —
              Supabase handles song storage, the database, and email-verified
              user authentication behind the scenes.
            </p>

            <p className="mt-2 sm:mt-4 text-xs sm:text-sm text-zinc-600">
              Engineering student project, built for learning rather than production.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3 sm:items-end">
            <span className="text-base sm:text-xl text-zinc-400">Created By Mayur Deshmukh</span>

           <div className="mt-3 sm:mt-6 flex flex-col gap-3 sm:gap-4">
             <a
              href="mailto:montydeshmukh11@gmail.com"
              className="group flex items-center gap-2 text-sm sm:text-base text-zinc-500 transition-colors hover:text-teal-400"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 6.5C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="m4 6.5 8 6.5 8-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              montydeshmukh11@gmail.com
            </a>

            <a
              href="https://www.linkedin.com/in/mayur-deshmukh-5873b2381"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm sm:text-base text-zinc-500 transition-colors hover:text-teal-400"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7.5 10v6.5M7.5 7.5v.01M12 16.5V12c0-1.1.9-2 2-2s2 .9 2 2v4.5"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              linkedin.com/in/mayur-deshmukh
            </a>
           </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-900 pt-6 text-xs text-zinc-600">
          Written by Mayur Deshmukh
        </div>
      </div>
    </footer>
  );
}