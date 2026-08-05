# Relay - Real-Time Communication Platform

A modern full-stack real-time one-to-one communication platform built with **Next.js**, **Express**, **PostgreSQL**, **Drizzle ORM**, **Socket.IO**, and **WebRTC**.

Relay is a production-style real-time communication platform featuring secure authentication, one-to-one messaging, group chats with role-based administration, media sharing, voice & video calling, and live synchronization powered by Socket.IO and React Query.

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

## Messaging

- One-to-one Real-Time messaging
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
- Message search
- Infinite scrolling
- Cursor pagination
- Live message editing
- Live message deletion
- Reply previews
- Media previews
- Auto read synchronization

---

## Real-Time Synchronization

- Socket.IO room architecture
- Live conversation updates
- Real-time group synchronization
- Live member join/leave
- Live admin promotion/demotion
- Live group rename
- Live conversation ordering
- Live unread count updates
- Live typing indicators
- Read receipt synchronization

---

## Group Chats

- Create groups
- Rename groups
- Add members
- Remove members
- Leave groups
- Delete groups
- Multiple administrators
- Promote members to admin
- Demote admins
- Real-time group updates
- Live member synchronization
- Automatic room management
- Role-based permissions

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
- ICE candidate exchange
- WebRTC signaling through Socket.IO

---

## Video Calling

- Real-time video calls
- Camera toggle
- Camera switching (mobile)
- Mute microphone
- Remote camera status
- Camera-off placeholder
- Picture-in-Picture (PiP) mode support
- Draggable floating video window
- Fullscreen / Restore
- Responsive mobile experience
- Draggable video window
- Camera switching
- Camera state synchronization

---

## Chat Requests

- Send request
- Accept request
- Reject request
- Cancel outgoing request

---

## Presence & Activity

- Single persistent Socket.IO connection per browser tab
- Online / Offline status
- Last seen
- Typing indicators
- Live unread counts
- Live online users
- Last seen updates
- Typing indicators
- Read receipts
- Live unread counters

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

## Performance

- Cursor-based pagination
- Infinite message loading
- React Query caching
- Optimistic UI updates
- Cache synchronization via Socket.IO
- Minimal API refetching
- Efficient room-based broadcasts

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

- Layered backend architecture
- Service-based business logic
- Socket.IO event-driven architecture
- Room-based real-time communication
- WebRTC peer-to-peer calling
- Cursor-based infinite pagination
- React Query cache synchronization
- Optimistic UI updates
- Secure HttpOnly cookie authentication
- Role-based group permissions
- Zod request validation
- Drizzle ORM with PostgreSQL
- Cloudinary media storage
- Fully typed TypeScript codebase
- Modular React hooks architecture
- Responsive mobile-first UI

---

# Project Structure

frontend/
├── app/
├── components/
├── hooks/
├── providers/
├── services/
├── lib/
└── types/

backend/
├── modules/
├── sockets/
├── middleware/
├── routes/
├── db/
├── services/
└── lib/

---

# Future Improvements

- TURN server for production-grade WebRTC
- Screen sharing
- End-to-end encryption
- Push notifications
- PWA support
- Message reactions
- Pinned messages
- Polls
- Voice/video group calls
- Message forwarding
- User blocking
- Archived chats

---

# Author

**Swayam Parab**

GitHub: https://github.com/swayamparab/Relay-Realtime_Communication_Platform