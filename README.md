# phishdv

A Phish data viewer built on [Next.js](https://nextjs.org/). Browse artists, venues, songs, shows, and setlists sourced from the [Phish.net API](https://docs.phish.net/) and stored locally in SQLite.

## Getting Started

Install dependencies and create a `.env.local` with your Phish.net API key:

```
PHISHNET_API_KEY=your_key_here
```

Then import the data and start the dev server:

```bash
npm install
npm run import:all
npm run import:setlists
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The data browser lives at [/browse](http://localhost:3000/browse).

## Data Import

Data is fetched from Phish.net and persisted to a local SQLite database via `better-sqlite3`. Individual importers live in [scripts/](scripts/):

- `npm run import:artists`
- `npm run import:venues`
- `npm run import:songs`
- `npm run import:shows`
- `npm run import:setlists`
- `npm run import:all` — runs artists, venues, songs, and shows in order (setlists are separate since they're large)

## Stack

- Next.js 16 + React 19 (App Router, TypeScript)
- Tailwind CSS v4 + shadcn/ui + Radix
- better-sqlite3 for local storage
- react-three-fiber / drei for 3D views
