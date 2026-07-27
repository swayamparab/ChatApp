# ChatApp

A modern real-time one-to-one messaging application built with **Next.js**, **Express**, **PostgreSQL**, **Drizzle ORM**, and **Socket.IO**.

## Architecture

- Next.js frontend deployed on Vercel
- Express + Socket.IO backend deployed on Render
- API and WebSocket traffic are proxied through Vercel rewrites (`/api` and `/socket.io`)
- Same-origin architecture for improved HttpOnly cookie handling and cross-browser compatibility
- Cursor-based message pagination for scalable conversations

---

## Features

### Authentication

- JWT Authentication with HttpOnly Cookies
- Secure protected routes
- Persistent login sessions

### Messaging

- Real-time one-to-one messaging with Socket.IO
- Text, Image and Video messaging
- Images and Videos upload with Cloudinary integration
- Reply to messages
- Edit your own text messages
- Delete your own messages
- Typing indicators
- Read receipts
- Unread message counts
- Cursor-based infinite message pagination
- Automatic scroll restoration while loading older messages
- Optimistic UI updates for seamless real-time messaging

### Media Sharing

- Image sharing
- Video sharing
- PDF and document sharing
- Voice message recording and playback

### Voice Messages

- Record voice messages directly in chat
- Custom audio player
- Play/Pause controls
- Seek through recordings
- Playback speed (1×, 1.5×, 2×)
- Recording timer
- Automatic pause when another voice message starts playing

### Media Preview

- Image viewer
- Video player
- File preview and download
- Voice message player

### Real-Time

- Live online/offline presence
- Last seen status
- Typing indicators
- Live unread message counts
- Automatic conversation preview updates
- Single persistent Socket.IO connection per browser tab

### Chat Requests

- Send chat requests
- Accept requests
- Reject requests
- Cancel outgoing requests

### User Experience

- Search users
- Responsive UI for desktop and mobile
- React Query caching
- Modern UI built with Tailwind CSS and shadcn/ui

---

## Tech Stack

### Frontend

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

### Backend

- Express.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- Socket.IO
- JWT Authentication
- bcrypt

---

## Screenshots

_Add screenshots here._

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/swayamparab/ChatApp.git
cd ChatApp
```

### Install dependencies

Frontend

```bash
npm install
```

Backend

```bash
npm install
```

### Environment Variables

Frontend

```env
NEXT_PUBLIC_API_URL=...
```

Backend

```env
DATABASE_URL=...
JWT_SECRET=...
CLIENT_URL=...
```

### Run the application

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

## Real-Time Features

- Instant messaging
- Typing indicators
- Online/offline presence
- Last seen updates
- Live unread message counts
- Automatic conversation reordering
- Live message editing
- Live message deletion
- Socket-based communication with a single persistent connection per browser tab

---

## Technical Highlights

- Layered backend architecture (Routes → Controllers → Services → Database)
- Socket.IO room-based messaging
- Cursor-based infinite scrolling
- React Query cache synchronization with WebSocket events
- Optimistic UI updates
- Secure HttpOnly cookie authentication
- Type-safe API validation with Zod
- Fully typed codebase using TypeScript

---

## Future Improvements

- file sharing
- Emoji reactions
- Message search
- Voice messages
- Group chats
- Push notifications
- End-to-end encryption

---

## Author

**Swayam Parab**

GitHub: https://github.com/swayamparab/ChatApp