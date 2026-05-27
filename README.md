# 🐛 BugLens AI — AI Debugging Assistant

An AI-powered full stack debugging assistant that analyzes code, explains bugs, suggests fixes, links documentation, and shows similar StackOverflow posts.

## 🚀 Features

- **Bug Explanation** — AI explains exactly what's wrong with your code
- **Suggested Fix** — Get corrected code instantly
- **Docs & References** — Relevant documentation links
- **StackOverflow Posts** — Similar questions from the community
- **History** — All past analyses saved to PostgreSQL
- **Multi-language Support** — Python, JavaScript, TypeScript, Java, Go, Rust, C++, SQL

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| AI | Groq API (LLaMA 3.3 70B) |
| Database | PostgreSQL |

## 📁 Project Structure

```
PS1-Project-AI-Debugging-Assistant/
├── frontend/          # React + Vite frontend
│   └── src/
│       ├── App.jsx
│       └── App.css
├── backend/           # FastAPI backend
│   ├── main.py
│   ├── database.py
│   └── .env
├── .gitignore
└── README.md
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- Python 3.9+
- PostgreSQL 15+

### 1. Clone the repo
```bash
git clone https://github.com/sabhyakumar/PS1-Project-AI-Debugging-Assistant.git
cd PS1-Project-AI-Debugging-Assistant
```

### 2. Backend setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn groq psycopg2-binary python-dotenv
```

Create a `.env` file in the `backend` folder:
```
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/buglens
```

### 3. Database setup
```bash
createdb buglens
psql buglens -c "CREATE ROLE postgres WITH LOGIN SUPERUSER;"
```

### 4. Frontend setup
```bash
cd frontend
npm install
```

## ▶️ Running the App

### Start the backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

### Start the frontend (new terminal)
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Analyze code and get bug report |
| GET | `/history` | Get recent analysis history |

### Example request
```json
POST /analyze
{
  "code": "def divide(a, b):\n    return a / b\n\ndivide(10, 0)",
  "language": "Python"
}
```

## 🔑 Getting a Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free
3. Click **API Keys** → **Create API Key**
4. Copy and paste into your `.env` file

---

Built by Sabhya Kumar
