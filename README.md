# Project Specula: Real-Time Job Market Intelligence

## Philosophy
"Specula" (Latin: Watchtower) is a tool designed to oversee the job market, identifying patterns, hidden skills, and trends that are not visible to the naked eye.

## Core Features
1. **Heatmap Analysis:** Visualizing hard/soft skill demand based on location/role.
2. **ATS Simulation:** Analyzing user CVs against current market data.
3. **Data Efficiency:** Smart caching to minimize API usage (JSearch).

## Tech Stack
- **Frontend:** React (Vite), TypeScript, Tailwind CSS, TanStack Query, Recharts.
- **Backend:** Python (FastAPI), Pydantic.
- **Data Source:** RapidAPI (JSearch).
- **Architecture:** Client-Server model with local caching (JSON/SQLite).

## Project Structure
- `/client`: Frontend application.
- `/server`: Backend API and Scraper logic.
- `/data`: (Planned) Storage for cached job postings.

## Current State
- Infrastructure set up.
- Backend running on :8000.
- Frontend running on :5173.