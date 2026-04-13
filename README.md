# 🚀 AI Portfolio Generator - Backend

Backend service for generating AI-powered portfolio websites from resumes.

---

## 🔥 Features

* PDF resume parsing
* AI-based data extraction (OpenRouter)
* JSON validation & cleanup
* Dynamic HTML generation
* Vercel auto deployment

---

## 🛠️ Tech Stack

* NestJS
* Sequelize
* Supabase (PostgreSQL)
* OpenRouter (LLM)
* Vercel API

---

## ⚙️ Setup

```bash
npm install
npm run start:dev
```

---

## 🔐 Environment Variables

```env
OPENROUTER_API_KEY=
VERCEL_TOKEN=
SUPABASE_DB_URL=
```

---

## 📌 API Endpoints

### Upload Resume

`POST /resume/upload`

### Deploy Portfolio

`POST /deploy`

---

## ⚡ Flow

1. Upload PDF
2. Extract text
3. AI parses data
4. User edits data
5. Generate HTML
6. Deploy to Vercel
