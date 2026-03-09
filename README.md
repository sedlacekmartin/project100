# Project 100

Project 100 is a web app / PWA focused on habit and addiction awareness through the number 100.

The core idea is simple:
the user creates an activity and tracks how long it takes to reach 100 units.

Examples:
- 100 km walked
- 100 push-ups
- 100 glasses of water
- 100 beers
- 100 cigarettes

The app measures elapsed time from the start of an activity until completion.

When the user reaches 100, the run is completed and saved to history.
On the next run, the app compares results and shows trends.

The app works with both:
- positive habits, where the user may try to improve in a healthy and voluntary way
- negative habits, where the user may try to extend the time and reduce frequency

## Main product idea

Project 100 is not meant to be just another generic habit tracker.
It is a simple, visual, time-based self-awareness tool.

The app should help users:
- start an activity
- increment progress quickly
- see current progress from 0 to 100
- understand elapsed time
- compare repeated attempts
- notice trends over time

## Product goals

- simple and fast to use
- mobile-first experience
- installable as a PWA
- clear visual dashboard
- strong focus on progress and time
- support for both healthy and unhealthy behavior tracking
- minimal friction when adding progress

## UX direction

- light mode by default
- minimal and clean design
- iOS-inspired visual language
- modern flat UI
- bento-style dashboard widgets
- strong readability
- easy scaling from mobile to desktop

## Planned main screens

- Landing / homepage
- Dashboard
- Activity detail
- Create activity
- Edit activity
- Login / register
- History
- Trends / comparison
- Settings

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- Vercel
- Supabase

## Current MVP status

Implemented in code:
- authentication with Supabase
- real dashboard loading activities, attempts, and logs
- create activity and auto-start first attempt
- quick logging (`+1`, `+5`, `+10`)
- auto-complete attempt when progress reaches 100
- start next attempt from the dashboard

Database schema:
- run `db/migrations/0001_project100.sql` in Supabase SQL editor
- ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

## Architecture direction

- Next.js App Router
- Supabase for database and authentication
- Vercel for deployment
- modular components
- MVP first, complexity later

## MVP scope

The first working version should allow:
- user authentication
- creating an activity
- starting an activity
- incrementing progress
- completing an activity at 100
- saving completed runs
- viewing history
- simple trend comparison

## Notes for development

- keep code simple and understandable
- prefer working features over premature abstraction
- prioritize clean UI and clear UX
- keep components reusable
- avoid overengineering early
