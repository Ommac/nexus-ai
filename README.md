# Nexus AI

Nexus AI is a modern real-time AI chat application built with the MERN stack. It provides secure authentication, real-time messaging using Socket.IO, AI-powered conversations with Google Gemini, and media uploads.

## Features

- 🔐 JWT Authentication
- 🤖 Google Gemini AI Integration
- 💬 Real-time Chat (Socket.IO)
- 📁 File & Image Sharing
- 👤 User Profiles
- 🌙 Modern Responsive UI
- ☁️ MongoDB Atlas Database

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT

## Installation

### Clone

```bash
git clone https://github.com/Ommac/nexus-ai.git
cd nexus-ai
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

## Environment Variables

Create a `.env` file and configure:

```env
MONGO_URI=
MONGO_DB_NAME=
JWT_SECRET=
GEMINI_API_KEY=
GEMINI_MODEL=
EMAIL=
PASSWORD=
AWS_BUCKET_NAME=
AWS_ACCESS_KEY=
AWS_SECRET=
FRONTEND_URL=
VITE_API_URL=
CORS_ORIGIN=
```

## Future Plans

- PDF Chat
- GitHub Repository Chat
- Document Upload
- AI Memory
- Voice Assistant

## License

MIT

---

Developed by **Om Pise**