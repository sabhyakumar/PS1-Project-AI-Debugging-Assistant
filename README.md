# 🐛 BugLens AI

**AI-Powered Debugging Assistant**

BugLens AI helps developers instantly identify and fix bugs in their code. Paste a snippet or error traceback, select a language, and get a structured AI-generated analysis — including a plain-English explanation, corrected code, relevant docs, and similar StackOverflow posts.

🔗 **Live Demo:** [ps1-project-ai-debugging-assistant.vercel.app](https://ps1-project-ai-debugging-assistant.vercel.app)

---

## ✨ Features

- 🌐 **Multi-language support** — Python, JavaScript, TypeScript, Java, Go, Rust, C++, SQL
- 🔍 **Automatic language detection** from pasted code
- 💡 **Load Example** button with language-specific buggy code samples
- 🤖 **AI-generated analysis** powered by LLaMA 3.3 70B via Groq API
- 📝 **Plain-English bug explanation**
- ✅ **Corrected code** with the fix applied
- 📚 **Relevant documentation links**
- 🔗 **Similar StackOverflow posts** with vote counts
- 🗂️ **Analysis history** stored in PostgreSQL, viewable in the History tab
- 🎨 **Black and orange dark theme UI**
- 📱 **Fully deployed** and accessible from any device

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Axios |
| Backend | FastAPI, Python, Uvicorn |
| AI Model | Groq API — LLaMA 3.3 70B |
| Database | PostgreSQL |
| Frontend Deployment | Vercel |
| Backend Deployment | Railway |

---

## 🏗️ Architecture

The app follows a standard client-server architecture:

- **Frontend** — React + Vite split-panel interface. Left panel for code input with auto language detection; right panel for AI analysis results. Communicates with the backend via Axios HTTP POST requests.
- **Backend** — FastAPI app on Uvicorn with two endpoints:
  - `POST /analyze` — accepts code and language, calls the Groq API, saves the result to PostgreSQL, and returns the analysis
  - `GET /history` — returns the last 10 analyses from the database
- **Database** — PostgreSQL stores submitted code, language, explanation, fix, doc links, StackOverflow references, and a timestamp per record.
- **AI** — The Groq API runs inference on LLaMA 3.3 70B. The prompt instructs the model to return a strictly structured JSON object, which the backend parses and forwards to the frontend.

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Python 3.10+
- PostgreSQL
- A [Groq API key](https://console.groq.com/)

### 1. Clone the repository

```bash
git clone https://github.com/sabhyakumar/PS1-Project-AI-Debugging-Assistant.git
cd PS1-Project-AI-Debugging-Assistant
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://postgres:password@localhost:5432/buglens
```

Start the backend:

```bash
uvicorn main:app --reload
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analyze` | Submit code for AI analysis. Returns explanation, fix, doc links, and StackOverflow posts. |
| `GET` | `/history` | Retrieve the last 10 analyses stored in the database. |

---

## ☁️ Deployment

- **Frontend** is deployed on [Vercel](https://vercel.com). Auto-redeploys on every push to `main`. Root directory is set to `frontend/`.
- **Backend** is deployed on [Railway](https://railway.app) with start command:
  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```
  The `GROQ_API_KEY` environment variable is configured in the Railway dashboard.

---

## 🧩 Challenges & Solutions

| Challenge | Solution |
|---|---|
| GitHub authentication failure | Generated a Personal Access Token with repo scope and embedded it in the remote URL |
| Groq model deprecated mid-build | Switched from `llama3-70b-8192` to `llama-3.3-70b-versatile` |
| PostgreSQL role not found on Mac | Manually created the `postgres` role using the `psql` command |
| Railway running on wrong port | Removed the hardcoded PORT variable and used Railway's `$PORT` environment variable |
| CORS blocking frontend requests | Set `allow_origins=["*"]` and corrected middleware placement in FastAPI |

---

## 👤 Author

**Sabhya Kumar**
GitHub: [@sabhyakumar](https://github.com/sabhyakumar)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
