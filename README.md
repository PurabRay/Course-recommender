# Course Recommender (Resource Recommender)

A full-stack web app that recommends learning resources tailored to your current skill level on any subject, powered by the **Llama 3.1 API**. Built with React and Node.js.

## What it does

Enter a subject you want to learn — the app recommends curated resources at beginner, intermediate, and advanced levels. Results are cached to keep things fast on repeat queries.

## Features

- **Level-aware recommendations** — separate resource lists for beginner, intermediate, and advanced learners
- **Any subject** — not limited to tech; works for any topic you want to study
- **Caching** — previously fetched recommendations are cached to improve performance and reduce API calls
- **3D parallax UI** — an immersive visual design built with CSS 3D transforms to enhance engagement

## Tech Stack

**Frontend:** React, CSS (3D parallax effects)  
**Backend:** Node.js, Express  
**AI:** Llama 3.1 API  

## Project Structure

```
Course-recommender/
├── client/     # React frontend
└── server/     # Node.js + Express backend
```

## Getting Started

```bash
# Server
cd server
npm install
# Add LLAMA_API_KEY to .env
npm start

# Client
cd client
npm install
npm start
```

**.env (server):**
```
LLAMA_API_KEY=your_key
PORT=5000
```

## How it works

1. User enters a subject and selects their current level (or gets all three)
2. Backend sends a structured prompt to Llama 3.1 requesting resources by level
3. Response is parsed and returned as a structured list
4. Results are cached in-memory so repeat queries are instant
