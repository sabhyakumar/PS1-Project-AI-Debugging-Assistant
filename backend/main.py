from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import json
import os
from dotenv import load_dotenv
from database import init_db, save_analysis

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class AnalyzeRequest(BaseModel):
    code: str
    language: str

@app.on_event("startup")
def startup():
    init_db()

@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    prompt = f"""You are an expert debugger. Analyze this {req.language} code and respond ONLY with a JSON object, no markdown, no backticks.

Code:
{req.code}

Respond with exactly this structure:
{{
  "explanation": "Clear explanation of the bug in 2-3 sentences",
  "fix": "The corrected code as a string",
  "docs": [
    {{"title": "Relevant doc title", "url": "https://...", "source": "docs.python.org"}},
    {{"title": "Another doc", "url": "https://...", "source": "docs.python.org"}}
  ],
  "stackoverflow": [
    {{"title": "Similar SO question", "url": "https://stackoverflow.com/questions/1098549/python-list-index-out-of-range", "source": "stackoverflow.com", "votes": 423}},
    {{"title": "Another SO question", "url": "https://stackoverflow.com/questions/9195700/off-by-one-error-with-range-and-len", "source": "stackoverflow.com", "votes": 217}}
  ]
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1024,
        temperature=0.1
    )

    result = json.loads(response.choices[0].message.content)
    save_analysis(req.code, req.language, result)
    return result

@app.get("/history")
def get_history():
    from database import get_recent
    return get_recent()