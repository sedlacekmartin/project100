# Tasks

## Current status

- Next.js app initialized
- local development server running
- homepage editing confirmed
- basic direction for the product defined

## Immediate next steps

### 1. Clean project structure
- confirm the real active app structure
- remove unused duplicate files
- remove confusing extra page files
- keep only the folders actually used by Next.js

### 2. Create proper base app structure
- create shared layout direction
- set up basic spacing and container system
- prepare reusable UI patterns

### 3. Build first landing page
- simple hero
- clear explanation of Project 100
- CTA to start
- preview of dashboard style

### 4. Build first dashboard skeleton
- bento layout
- placeholder widgets
- responsive mobile-first structure

### 5. Prepare Supabase
- create Supabase project
- connect environment variables
- test connection

### 6. Add authentication
- sign up
- log in
- protected dashboard route
- log out

### 7. Design database schema
Initial likely entities:
- users
- activities
- activity_runs
- activity_entries

### 8. Implement create activity flow
- title
- type (positive / negative)
- unit
- optional icon / color later

### 9. Implement run tracking
- start activity
- add progress
- stop at 100
- save result

### 10. Implement history and trend basics
- list completed runs
- compare against previous run
- show trend direction

## MVP checklist

- [x] clean project structure
- [x] landing page
- [x] dashboard skeleton
- [ ] Supabase project connected
- [ ] auth working
- [ ] protected routes working
- [ ] create activity
- [ ] list activities
- [ ] activity detail
- [ ] add progress
- [ ] complete run at 100
- [ ] save run history
- [ ] show previous results
- [ ] basic trend comparison
- [ ] deploy to Vercel

## UI checklist

- [ ] light default theme
- [ ] minimal iOS-like feel
- [ ] rounded cards
- [ ] clean typography
- [ ] bento dashboard widgets
- [ ] responsive mobile layout
- [ ] simple CTA styling
- [ ] polished empty states

## Notes for implementation

- keep MVP small
- avoid overcomplicated architecture
- do not build charts too early
- focus on real working flow first
- keep naming consistent
- use reusable components where it helps
