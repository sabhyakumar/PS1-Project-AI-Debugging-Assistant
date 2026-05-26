import psycopg2
import os
import json
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/buglens")

def get_conn():
    return psycopg2.connect(DB_URL)

def init_db():
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id SERIAL PRIMARY KEY,
                code TEXT NOT NULL,
                language VARCHAR(50),
                explanation TEXT,
                fix TEXT,
                docs JSONB,
                stackoverflow JSONB,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Database ready")
    except Exception as e:
        print(f"⚠️  DB not connected (running without DB): {e}")

def save_analysis(code, language, result):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO analyses (code, language, explanation, fix, docs, stackoverflow)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            code,
            language,
            result.get("explanation"),
            result.get("fix"),
            json.dumps(result.get("docs", [])),
            json.dumps(result.get("stackoverflow", []))
        ))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"⚠️  Could not save to DB: {e}")

def get_recent():
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, language, explanation, created_at
            FROM analyses
            ORDER BY created_at DESC
            LIMIT 10
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return [{"id": r[0], "language": r[1], "explanation": r[2], "created_at": str(r[3])} for r in rows]
    except:
        return []
