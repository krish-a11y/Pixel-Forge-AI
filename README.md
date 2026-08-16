# Pixel Forge AI 🎨

A media toolkit built with Next.js that lets you upload videos and images, compress them, and instantly reformat images for different social media platforms — all powered by Cloudinary.

## Features

- 🔐 **Authentication** — sign up / sign in via Clerk
- 🎬 **Video upload & compression** — upload videos (up to 60MB), automatically compressed and transcoded to MP4 via Cloudinary, with original vs. compressed size tracked in Postgres
- 🖼️ **Social media image resizer** — upload an image once and instantly reformat it for:
  - Instagram Square (1:1)
  - Instagram Portrait (4:5)
  - Twitter Post (16:9)
  - Twitter Header (3:1)
  - Facebook Cover (205:78)
- 📥 **One-click download** of transformed images and compressed videos
- 📊 **Dashboard/home feed** listing all uploaded videos with size comparisons

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript |
| Auth | [Clerk](https://clerk.com) |
| Media storage/processing | [Cloudinary](https://cloudinary.com) (`cloudinary`, `next-cloudinary`) |
| Database | PostgreSQL via [Prisma ORM 7](https://www.prisma.io) (`@prisma/adapter-pg`) |
| Styling | Tailwind CSS + daisyUI |
| HTTP client | Axios |

## Project Structure

```
src/
├── app/
│   ├── (app)/
│   │   ├── home/            # Dashboard listing uploaded videos
│   │   ├── social-share/    # Image upload + social format resizer
│   │   ├── video-upload/    # Video upload form
│   │   └── layout.tsx       # Authenticated app shell / sidebar
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   └── api/
│       ├── image-upload/    # POST — uploads an image to Cloudinary
│       ├── video-upload/    # POST — uploads/compresses a video, saves metadata to DB
│       └── videos/          # GET  — lists all videos from the DB
├── components/
│   └── VideoCard.tsx
prisma/
└── schema.prisma            # Video model (title, description, sizes, duration, etc.)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. via [Prisma Postgres](https://www.prisma.io/postgres), Supabase, Neon, or local Postgres)
- A [Cloudinary](https://cloudinary.com) account
- A [Clerk](https://clerk.com) account

### 1. Clone the repo

```bash
git clone https://github.com/krish-a11y/Pixel-Forge-AI.git
cd Pixel-Forge-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Set up the database

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## How It Works

- **Video upload** (`/video-upload`): the client sends the video file + metadata (title, description, original size) to `/api/video-upload`. The API route streams it to Cloudinary (auto quality, transcoded to MP4), then stores the video's public ID, original/compressed sizes, and duration in Postgres via Prisma.
- **Social share** (`/social-share`): the client uploads an image to `/api/image-upload`, which stores it on Cloudinary and returns a `publicId`. The frontend then uses `next-cloudinary`'s `CldImage` component to render on-the-fly transformations for each social media aspect ratio, which can be downloaded directly.
- **Home** (`/home`): fetches all saved videos from `/api/videos` and renders them with original vs. compressed size comparisons.

## License

No license specified yet. Add one (e.g. MIT) if you plan to open source this project.