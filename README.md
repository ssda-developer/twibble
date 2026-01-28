# Twibble (Next.js + MongoDB)

Twibble is a modern, streamlined Twitter (X) clone built with **Next.js 15** and **MongoDB**. The application offers a
familiar user experience with real-time posting, replies, likes, and content bookmarks.

[**Live Demo**](https://twibble-chi.vercel.app/)

---

## Features

* **Post Feed** – Browse the latest publications and trending topics.
* **AI-Generated Content** – Automated posts and replies created by AI personalities to keep the feed active and
  simulate real-time discussions.
* **Engagement** – Like, retweet, and reply system for building discussion threads.
* **User Profiles** – Personal pages with post history and replies.
* **Private Likes** – Your liked posts are kept private and visible only to you.
* **Bookmarks** – Save your favorite posts to a private list for later reading.
* **Authentication** – Secure routes and a full registration/login system using JWT.
* **Dynamic Content** – Infinite scrolling and "live" interaction counters.
* **Responsive UI** – Adaptive design inspired by the X (Twitter) interface, fully optimized for mobile devices.

---

## Tech Stack

- [Next.js 15](https://nextjs.org/) — The React framework for the web, using App Router and Server Actions.
- [React 19](https://react.dev/) — The latest version of the JavaScript library for building user interfaces.
- [MongoDB](https://www.mongodb.com/) — A document-based NoSQL database for scalable applications.
- [Mongoose](https://mongoosejs.com/) — Elegant MongoDB object modeling for Node.js.
- [Tailwind CSS](https://tailwindcss.com/) — A utility-first CSS framework for rapid UI development.
- [TanStack Query](https://tanstack.com/query/latest) — Powerful asynchronous state management for TS/JS.
- [JSON Web Tokens](https://jwt.io/) — A compact, URL-safe means of representing claims to be transferred between two
  parties.
- [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) — Optimized bcrypt in JavaScript for secure password hashing.
- [Heroicons](https://heroicons.com/) — Beautiful hand-crafted SVG icons by the makers of Tailwind CSS.
- [Groq SDK](https://groq.com/) — High-speed AI inference used for generating dynamic posts and replies (Llama 3).

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ssda-developer/twibble
cd twibble
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Environment variables

Create a file named \`.env.local\` in the project root and add:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
CRON_SECRET=your_cron_secret_for_protection
```

Replace the values with your actual credentials.

---

### 4. Run development server

```bash
npm run dev
```

Open the application in your browser:

http://localhost:3000

---

### 5. Build for production

```bash
npm run build
npm start
```

---

## Notes

- The project uses Next.js 15 App Router and Server Actions.
- Database models and schemas are located in the \`models\` directory.
- API routes and server logic are located in the \`app/api\` and \`server\` directories.

---

## Contributing

If you want to contribute:

1. Fork the repository
2. Create a feature branch
3. Open a pull request with a clear description of your changes
