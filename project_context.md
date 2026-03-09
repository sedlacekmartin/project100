# Project Context

## What Project 100 is

Project 100 is a web app / PWA for tracking habits and addictions using a fixed target: 100.

Instead of only checking whether a habit was done today, the app measures:
- progress
- elapsed time
- repetition
- trend between attempts

The main value is awareness through time and repetition.

## Core mechanic

The user creates an activity with a target of 100 units.

Examples:
- 100 km walking
- 100 push-ups
- 100 glasses of water
- 100 beers
- 100 cigarettes

The user starts the activity.
From that moment, time begins to run.

Each time the user performs the action, they add progress:
- usually +1
- possibly custom increments later

When the total reaches 100, the run is completed and saved.

The app then stores:
- start time
- completion time
- total duration
- activity type
- notes or metadata in the future

## Positive vs negative activities

There are two core categories:

### Positive activities
Examples:
- walking
- push-ups
- drinking water
- reading
- stretching

Desired trend:
- improve naturally
- reduce completion time only in a healthy and voluntary way
- build consistency

### Negative activities
Examples:
- cigarettes
- beers
- junk food episodes
- energy drinks
- other compulsive behaviors

Desired trend:
- increase completion time
- reduce frequency
- build awareness and self-control

## Why this is different from a normal habit tracker

This is not only:
- a streak app
- a checkbox app
- a daily planner

This app focuses on:
- elapsed time between start and finish
- repeated attempts
- visual comparison of runs
- behavioral trend recognition

It should feel simple, direct, and a bit game-like, but still useful and serious.

## UI and visual direction

Preferred direction:
- default light mode
- minimal iOS-inspired aesthetic
- bento dashboard layout
- flat, modern surfaces
- rounded cards
- spacious layout
- strong typography
- clean progress visuals
- subtle but polished interactions

Avoid:
- overly technical sci-fi UI
- clutter
- too many borders
- too much visual noise
- generic “corporate SaaS” feeling

## Dashboard vision

The dashboard should use bento-style widgets / tiles.

Examples of possible dashboard blocks:
- current active activity
- quick add action
- daily summary
- recent completed runs
- trend widget
- strongest improvement / worst regression
- motivational or insight card
- streak or consistency block
- total completed activities

The dashboard should feel like a personal control center.

## Main screens planned

### 1. Landing / homepage
Purpose:
- explain the concept
- welcome the user
- guide into login or dashboard

### 2. Dashboard
Purpose:
- overview of all relevant information
- bento layout
- quick actions
- current status

### 3. Activity detail
Purpose:
- show one activity in depth
- progress from 0 to 100
- elapsed time
- history of runs
- comparison with previous attempts
- quick increment button

### 4. Create activity
Purpose:
- create a new positive or negative activity
- choose title, type, unit, icon, maybe color

### 5. Login / register
Purpose:
- authentication and onboarding

### 6. History / trends
Purpose:
- completed runs
- best / worst times
- trend direction
- maybe charts later

### 7. Settings
Purpose:
- profile
- preferences
- visual settings
- notifications later

## Product principles

- simple first
- fast interaction
- clear feedback
- mobile-first
- low friction
- understandable data
- clean visual hierarchy

## Technical direction

Framework:
- Next.js with App Router

Language:
- TypeScript

Styling:
- Tailwind CSS

Backend:
- Supabase

Hosting:
- Vercel

## Development mindset

The project should be built step by step.

Priority order:
1. working structure
2. working auth
3. working data model
4. working activity flow
5. polished UI
6. advanced insights
7. PWA refinement

Avoid building advanced features too early.

## Important implementation notes

- keep folder structure clean
- avoid duplicate routes and duplicate page files
- keep components modular
- prefer readable code over clever code
- use server/client boundaries intentionally
- MVP first, polish second

## Future ideas

Possible future features:
- custom target values besides 100
- reminders
- notifications
- charts
- streak systems
- badges / milestones
- notes on each run
- tags / categories
- social or sharing features
- widgets
- offline support improvements
- import/export