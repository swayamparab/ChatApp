# ChatApp

A modern real-time one-to-one chat application built with Next.js, Express, PostgreSQL, Drizzle ORM, and Socket.IO.

## Features

- 🔐 JWT Authentication with HttpOnly Cookies
- 💬 Real-time messaging using Socket.IO
- 👥 One-to-one conversations
- 📩 Chat requests (Send, Accept, Reject, Cancel)
- 🟢 Typing indicators
- 🗑️ Delete messages
- 🔎 Search users
- 📱 Responsive UI (Desktop & Mobile)
- ⚡ React Query for server state management
- 🎨 Modern UI built with Tailwind CSS & shadcn/ui

---

## Tech Stack

### Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Socket.IO Client
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

## Project Structure

```
Frontend
├── Next.js
├── Components
├── Hooks
├── Services
├── Providers
└── React Query

Backend
├── Express
├── Controllers
├── Services
├── Routes
├── Socket Events
├── Middleware
└── Drizzle ORM
```

---

## Getting Started

### Clone

```bash
git clone https://github.com/<your-username>/chatapp.git
cd chatapp
```

### Backend

```bash
cd backend

npm install

npm run dev
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

### Backend

```env
DATABASE_URL=

JWT_SECRET=

CLIENT_URL=
```

### Frontend

```env
NEXT_PUBLIC_API_URL=
```

---

## Future Improvements

- Read receipts
- Online/offline presence
- Image & file sharing
- Emoji reactions
- Group chats
- Voice messages
- Push notifications

---

## Author

**Swayam Parab**

GitHub: https://github.com/swayamparab
