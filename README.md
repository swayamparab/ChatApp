# Relay - Real-Time Communication Platform

A modern full-stack real-time one-to-one communication platform built with **Next.js**, **Express**, **PostgreSQL**, **Drizzle ORM**, **Socket.IO**, and **WebRTC**.

Relay provides secure messaging, media sharing, voice & video calling, and a responsive experience across desktop and mobile.

---

## Architecture

- **Frontend:** Next.js 15 + React + TypeScript (Vercel)
- **Backend:** Express.js + Socket.IO + TypeScript (Render)
- **Database:** PostgreSQL + Drizzle ORM
- **Media Storage:** Cloudinary
- **Real-Time Communication:** Socket.IO
- **Voice & Video Calls:** WebRTC (STUN)

### Architecture Highlights

- Next.js frontend deployed on Vercel
- Express + Socket.IO backend deployed on Render
- API & WebSocket traffic proxied through Vercel rewrites (`/api` and `/socket.io`)
- Same-origin architecture for secure HttpOnly cookie authentication
- Cursor-based message pagination for scalable conversations

---

# Features

## Authentication

- JWT Authentication
- Secure HttpOnly Cookies
- Protected Routes
- Persistent Login Sessions

---

## Real-Time Messaging

- One-to-one real-time messaging
- Text messages
- Image messages
- Video messages
- Document sharing
- Reply to messages
- Edit messages
- Delete messages
- Typing indicators
- Read receipts
- Unread message counts
- Live conversation preview updates
- Automatic conversation reordering
- Optimistic UI updates
- Cursor-based infinite scrolling
- Automatic scroll position restoration

---

## Voice Messages

- Record voice messages
- Voice message playback
- Play / Pause
- Seek support
- Playback speed controls
- Recording timer
- Auto pause when another voice message starts

---

## Media Sharing

- Image uploads
- Video uploads
- Document sharing
- Cloudinary integration
- Image preview
- Video preview
- File preview
- Download attachments

---

## Voice Calling

- Real-time voice calling
- Busy state handling
- Incoming call screen
- Outgoing call screen
- Call timeout
- Call duration
- Mute microphone
- Ongoing call card
- Speaker selection (supported browsers)

---

## Video Calling

- Real-time video calls
- Camera toggle
- Camera switching (mobile)
- Mute microphone
- Remote camera status
- Camera-off placeholder
- Picture-in-Picture (PiP) mode
- Draggable floating video window
- Fullscreen / Restore
- Responsive mobile experience

---

## Chat Requests

- Send request
- Accept request
- Reject request
- Cancel outgoing request

---

## Presence

- Online / Offline status
- Last seen
- Typing indicators
- Live unread counts
- Single persistent Socket.IO connection per browser tab

---

## User Experience

- Responsive UI
- Desktop & Mobile support
- React Query caching
- Modern UI with Tailwind CSS
- shadcn/ui components
- Toast notifications
- Optimistic updates

---

# Tech Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack React Query
- Socket.IO Client
- Axios
- React Hook Form
- Zod
- Sonner

---

## Backend

- Express.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- Socket.IO
- WebRTC
- JWT
- bcrypt

---

## Screenshots

_Add screenshots here._

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/swayamparab/Relay-Realtime_Communication_Platform.git
```

---

## Install Dependencies

### Frontend

```bash
npm install
```

### Backend

```bash
npm install
```

---

## Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_URL=
```

### Backend

```env
DATABASE_URL=
JWT_SECRET=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Run Development Server

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

---

# Technical Highlights

- Layered backend architecture (Routes → Controllers → Services → Database)
- Socket.IO room-based messaging
- WebRTC peer-to-peer audio/video communication
- STUN server integration
- Cursor-based infinite pagination
- React Query cache synchronization
- Optimistic UI updates
- Secure HttpOnly cookie authentication
- Type-safe API validation with Zod
- Fully typed TypeScript codebase
- Modular frontend architecture using custom hooks and providers

---

# Future Improvements

- TURN server for production-grade WebRTC reliability
- Call history
- Group chats
- Screen sharing
- Emoji reactions
- Message search
- Push notifications
- End-to-end encryption

---

# Author

**Swayam Parab**

GitHub: https://github.com/swayamparab/Relay-Realtime_Communication_Platform