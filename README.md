# 🎵 MelodyStream

> **Your Music, Anytime.** A modern, responsive full-stack music streaming platform built with Next.js 16, Supabase, Tailwind CSS, and Zustand.

---

## 🌟 Overview

**MelodyStream** is a full-featured music streaming web application designed to deliver a smooth and visually captivating audio listening experience across both desktop and mobile devices. 

It leverages **Supabase** for database storage, file hosting, and authentication, combined with **Next.js 16 (App Router)** for fast server-side rendering, robust API routes, and modern UI performance.

---

## ✨ Features

### 🎧 Global Audio Player
- **Persistent Playback:** The music never stops playing when browsing across pages.
- **Vinyl Record Animation:** Album art rotates like a vinyl record with continuous CSS animations during playback.
- **Playback Controls:** Play, pause, skip previous/next, shuffle, and cycle repeat modes (`off`, `all`, `one`).
- **Interactive Seekbar:** Real-time track progress with seeking support and formatted time indicators (`mm:ss`).
- **Volume Memory:** Volume slider with mute toggle and persistent level saved in `localStorage`.
- **Mobile-Optimized Scrubber:** Streamlined edge-to-edge top scrubber bar on small mobile screens.

### ⌨️ Keyboard Shortcuts
Control your music on desktop effortlessly without touching the mouse:
| Key | Action |
| :--- | :--- |
| `Space` | Play / Pause |
| `ArrowRight` | Next Track |
| `ArrowLeft` | Previous Track |
| `ArrowUp` | Volume Up (+10%) |
| `ArrowDown` | Volume Down (-10%) |
| `M` / `m` | Mute / Unmute |

*(Keyboard shortcuts are automatically suppressed while typing in input fields)*

### 🔍 Real-Time Live Search
- Debounced search bar querying both Hindi and English song collections.
- Floating glassmorphism dropdown results with album thumbnails and instant single-click play.

### 🔐 Custom Authentication & Email Verification
- **Dual-Login Support:** Log in using either your **Username** or **Email Address**.
- **Pending Verification Flow:** User details are temporarily staged in a `pending_user` table with secure token expiration (1 hour).

- **Automated Verification Emails:** Sent via **Resend SMTP** and **Nodemailer** featuring branded HTML email templates.
- **Account Activation:** Verifying the email automatically registers the user into Supabase Auth and creates their public profile.(This only works for resend verified email.If want to send emails to anyone have to verify the domain)

### 📱 Responsive & Touch-Ready Design
- **Mobile Snap-Scrolling:** Horizontal song carousels equipped with native touch-momentum swipe snapping (`snap-x snap-mandatory`).
- **Dynamic Viewport (`dvh`):** Layout automatically adjusts to mobile browser address bars (Safari/Chrome).
- **Glassmorphism Aesthetic:** Sleek dark mode styling with ambient glowing orbs, blur filters (`backdrop-blur-2xl`), and vibrant purple accents.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** [Zustand 5](https://github.com/pmndrs/zustand)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

### **Backend & Database**
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL & Supabase Auth)
- **Storage:** Supabase Storage (Audio & Album Art buckets)
- **API Engine:** Next.js Route Handlers (REST API)
- **Mailing:** [Nodemailer](https://nodemailer.com/) + [Resend](https://resend.com/)

---

## 📁 Project Structure

```text
melodystream/
├── public/                 # Static public assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # Backend REST API endpoints
│   │   │   ├── login/      # Dual-identifier login endpoint
│   │   │   ├── signup/     # Registration with token generator
│   │   │   └── verify-email/# Token confirmation handler
│   │   ├── login/          # Login page UI
│   │   ├── signup/         # Signup page UI
│   │   ├── globals.css     # Global styles & Tailwind theme tokens
│   │   ├── layout.tsx      # Root layout with GlobalPlayer & NavBar
│   │   └── page.tsx        # Homepage with song rows & collections
│   ├── components/         # Reusable React components
│   │   ├── Footer.tsx      # Responsive footer
│   │   ├── GlobalPlayer.tsx# Persistent bottom audio player & scrubber
│   │   ├── NavBar.tsx      # Navigation header with live search & auth
│   │   ├── SongCard.tsx    # Individual track card with cover art & play button
│   │   └── SongRow.tsx     # Horizontal scrollable category row
│   ├── lib/                # Utilities & service helpers
│   │   └── mailer.ts       # Nodemailer + Resend email transporter
│   ├── store/              # Global state management
│   │   └── usePlayerStore.ts # Zustand audio player state & queue logic
│   ├── type.ts             # TypeScript definitions (Song, etc.)
│   ├── utils/              # Supabase client helpers (client, server, middleware)
│   └── middleware.ts       # Next.js auth session middleware
├── .env.local              # Local environment variables
└── package.json            # Project dependencies & scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.17.0 or higher recommended)
- **npm** / **yarn** / **pnpm**
- A free **[Supabase](https://supabase.com/)** account
- A free **[Resend](https://resend.com/)** account (for sending verification emails)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/melodystream.git
cd melodystream
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory and add the following variables:

```env
# Application Base URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Resend API Key (for email verification)
RESEND_API_KEY=re_your_api_key_here
```

### 5. Supabase Setup

#### Tables Schema
In your Supabase SQL editor, create the required tables:

```sql
-- Public user profile table
create table public.user (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  username text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pending user verification table
create table public.pending_user (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  username text not null,
  password text not null,
  token text unique not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### Storage Buckets
Create a public bucket named **`melodyStream`** with the following folder structure:
- `melodyStream/songs/` (Hindi audio files)
- `melodyStream/song images/` (Hindi cover art matching song title `.jpg`)
- `melodyStream/eng songs/` (English audio files)
- `melodyStream/eng song images/` (English cover art matching song title `.jpg`)

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the app.

---

## 📡 REST API Reference

The backend endpoints can also be consumed by mobile apps (such as **React Native**):

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/signup` | Registers pending user & sends verification email | `{ "email": "...", "username": "...", "password": "..." }` |
| `POST` | `/api/login` | Authenticates with email or username | `{ "identifier": "...", "password": "..." }` |
| `GET` | `/api/verify-email?token=...` | Verifies email token & activates account | Query Param: `token` |

---

## 👨‍💻 Author

**Mayur Deshmukh**
- **Email:** [montydeshmukh11@gmail.com](mailto:montydeshmukh11@gmail.com)
- **LinkedIn:** [linkedin.com/in/mayur-deshmukh-5873b2381](https://www.linkedin.com/in/mayur-deshmukh-5873b2381)

---

## 📄 License

This project is created for educational and practice purposes as part of learning full-stack development. Feel free to use and adapt the code.
