import type { Metadata } from 'next';
import './globals.css';
// import Sidebar from '@/components/Sidebar';
import GlobalPlayer from '@/components/GlobalPlayer'; // Aapne component ka naam yehi rakha tha
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'MelodyStream',
  description: 'Your music, anytime.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden h-[100dvh] flex flex-col">
        <div className="flex flex-1 h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-6rem)]">
          {/* <Sidebar /> */}
          
          <div className="flex-1 flex flex-col overflow-y-auto bg-background">
            <NavBar/>
            <main className="flex-1 pb-20 sm:pb-28">
              {children}
            </main>
          </div>
        </div>

        <GlobalPlayer />
      </body>
    </html>
  );
}
