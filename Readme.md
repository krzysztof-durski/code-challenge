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

Try `/?city=Tokyo` to open a result directly.

## Notes

Design and engineering decisions are in [docs/DECISIONS.md](docs/DECISIONS.md).

Extra detail: sunrise and sunset.

### AI usage

**What AI helped with.** I used Claude Code (Claude Sonnet 5.5) to plan and write the app, the tests and the docs. It probed the Open-Meteo API with real requests before the code was written, which is where the "no results key means not found" and "times are local strings without an offset" facts come from. It also picked a design theme (Wayfind, from the Hallmark skill) and generated the token CSS.

**What was changed.** TODO(author): list what you changed by hand after review.

**What was verified.**
- `npm test` runs a small set of tests for the logic that is easy to get wrong (API parsing, time zones, stale responses) and one per UX state.
- Headless Chrome screenshots against the live API for the empty state, a found city, a not-found city, and a narrow viewport.
- Typecheck and production build are clean.
- Not verified: keyboard-only and screen reader use, and the loading skeleton on screen (it is covered by tests only).
