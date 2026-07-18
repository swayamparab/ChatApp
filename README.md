# ChatApp

A modern real-time one-to-one messaging application built with **Next.js**, **Express**, **PostgreSQL**, **Drizzle ORM**, and **Socket.IO**.

## Features

- 🔐 JWT Authentication with HttpOnly Cookies
- 💬 Real-time one-to-one messaging using Socket.IO
- 🟢 Live online/offline presence
- Live Unread Count Marker
- ⌨️ Real-time typing indicators
- 🤝 Chat request system
  - Send requests
  - Accept requests
  - Reject requests
  - Cancel outgoing requests
- 🗑️ Delete your own messages
- 🔍 Search users
- 📱 Responsive UI for desktop and mobile
- ⚡ React Query caching and optimistic UI updates
- 🎨 Modern UI built with Tailwind CSS and shadcn/ui

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

### Run

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
- Live online/offline status
- Automatic conversation updates
- Socket-based communication with a single persistent connection per browser tab

---

## Future Improvements

- Last Seen
- Read Receipts
- Unread Message Counts
- Image/File Sharing
- Message Reactions
- Edit Messages
- Emoji Picker

---

## Author

**Swayam Parab**

GitHub: https://github.com/swayamparab