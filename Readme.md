# City Snapshot

A small web app that allows users to enter a city and view a compact snapshot containing current weather information, local time, and one additional detail.

## Challenge Goal

The goal of this exercise is not to build a complete product, but to demonstrate:

- code clarity and structure
- problem-solving skills
- UI / visual judgment
- ability to work effectively with or without AI tools

## Requirements

Build a small web application that:

- allows the user to enter a city name
- displays a city snapshot card with:
  - city name
  - current temperature
  - weather condition
  - local time
  - one additional detail of your choice
    (for example: humidity, wind, sunrise/sunset)

## UX Expectations

Your app should include:

- an **empty state** before any search
- a **loading state** while data is being fetched
- an **error state** for invalid input or failed requests

The UI should be simple, clean, and usable.

## Technical Guidelines

- You may use any framework or plain JavaScript
- You may use any public API or mocked data
- One page is sufficient
- No authentication is required
- Keep the implementation lightweight

## AI Usage

You are explicitly allowed to use AI tools such as ChatGPT, Copilot, Cursor, or similar.

We are interested in how you use them:

- what they helped you with
- what you changed
- what you verified yourself

Please document this briefly in the section below.

## Timebox

Please spend **about 45 minutes** on this challenge.  
You may go up to **60 minutes maximum**, but completeness matters less than good judgment.

## Submission

Please submit:

- a Git repository link or zip file
- this README completed with your notes
- your implementation

## Setup Instructions

Needs Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm test           # unit and component tests
npm run build      # typecheck and production build
```

## Notes

Extra detail: sunrise and sunset.

### AI usage

**What AI helped with.** I used Claude Code (Claude Sonnet 5.5) to plan and write the app, the tests and the docs. Once I had picked the API, it probed Open-Meteo with real requests before the code was written, which is where the "no results key means not found" and "times are local strings without an offset" facts come from. It also picked a design theme (Wayfind, from the Hallmark skill) and generated the token CSS.

**Design.** I left the design mostly to Claude, following the Hallmark skill guidelines and the rules in `CLAUDE.md`.

**API choice.** I chose Open-Meteo and checked it myself before starting, to make sure it has everything the app needs. Claude then probed it with real requests so it had the context, instead of me explaining it.

**Original prompt:** Create a plan for "City snapshot" weather app. It alows user to enter a city name and it displays: city name, current temperature, weather conditions, LOCAL time and sunrise/sunset times. For that data use open-meteo api. I need 3 states: empty state, loading state, and error state. Keep it lightweight. Use Vite+React+Typescript, test essentials with vitest.

**What was changed.** I reviewed the generated code, then refactored it together with Claude. I chose what to change and Claude made the edits:

- `ErrorState`: a typed message table instead of an `if / else` chain.
- `useCitySnapshot`: stable `search` callback, so the `eslint-disable` in `App` is gone.
- `roundTemperature` helper (with a test) instead of the `Math.round(x) + 0` trick.

**What was verified by me.**

- Read and proofread all of the generated code.
- Had checked how the Open-Meteo API behaves before choosing it (a city that does not exist, how the local time and sun times are returned).
- I ran the app and tried the empty, loading, found, not-found and error states.
- `npm test` passes, and typecheck and production build are clean.

**Time.** Built within the timebox, except for this README.
