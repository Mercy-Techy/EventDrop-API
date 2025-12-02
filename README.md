# EventDrop API

A backend API for creating and managing event-based photo galleries. Event owners can create events, generate unique upload links, and allow guests to upload photos without authentication. Supports real-time updates using Socket.IO, photo moderation, likes/comments, and optional premium features.

## Features

Create and manage events

Generate unique public upload links

Guests can upload photos without login

Real-time photo updates using Socket.IO

Event owners can approve photos before they go live

Users can like and comment on photos

Event expiration for non-premium accounts

Automatic watermarking

Photographer high-quality upload support

## Tech Stack

Node.js

Express.js

TypeScript

PostgreSQL

Socket.IO

Cloud storage (Cloudinary)

## Commands

```bash
# Install dependencies
yarn install

# Start in development (transpile only)
yarn dev

# Build production output
yarn build

# Start production build
yarn start
```

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/Mercy-Techy/EventDrop-API.git
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Build the project:
   ```bash
   yarn build
   ```
4. Start the server:
   ```bash
   yarn start
   ```

## Documentation

Visit: `BASE_URL/documentation`
