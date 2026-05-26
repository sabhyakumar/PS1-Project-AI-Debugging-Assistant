import { useState } from "react";
import axios from "axios";
import "./App.css";

const LANGUAGES = ["Python", "JavaScript", "TypeScript", "Java", "Go", "Rust", "C++", "SQL"];

function detectLang(code) {
  if (/def |import |print\(/.test(code)) return "Python";
  if (/function |const |let |=>/.test(code)) return "JavaScript";
  if (/SELECT|FROM|WHERE/i.test(code)) return "SQL";
  return null;
}

export default function App() {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("Python");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("analyze");
  const [history, setHistory] = useState([]);

  function handleCodeChange(e) {
    const val = e.target.value;
    setCode(val);
    const detected = detectLang(val);
    if (detected) setLang(detected);
  }

  async function analyze() {
    if (!code.trim()) { setError("Please paste some code first."); return; }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("http://localhost:8000/analyze", { code, language: lang });
      setResult(res.data);
      setHistory(prev => [{ code: code.slice(0, 60) + "…", lang, result: res.data }, ...prev.slice(0, 4)]);
    } catch (e) {
      setError("Backend error — make sure the API server is running.");
    }
    setLoading(false);
  }

  function loadExample() {
    setCode(`def process_data(items):
    total = 0
    for i in range(len(items) + 1):  # Off-by-one error
        total += items[i]
    return total / len(items)

result = process_data([10, 20, 30])`);
    setLang("Python");
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">
          <div className="logo-icon">🐛</div>
          BugLens AI
        </div>
        <nav className="nav-pills">
          <button className={`pill ${tab === "analyze" ? "active" : ""}`} onClick={() => setTab("analyze")}>Analyze</button>
          <button className={`pill ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
            History {history.length > 0 && <span className="badge">{history.length}</span>}
          </button>
        </nav>
        <div className="status">
          <span className="dot" /> Connected
        </div>
      </header>

      {tab === "analyze" ? (
        <main className="main-grid">
          {/* LEFT — Code Input */}
          <section className="panel input-panel">
            <div className="panel-head">
              <span>Your code / error</span>
              <span className="lang-tag">{lang}</span>
            </div>
            <div className="code-area">
              <textarea
                className="code-input"
                value={code}
                onChange={handleCodeChange}
                placeholder={`# Paste your buggy code or error here…\n\ndef divide(a, b):\n    return a / b\n\ndivide(10, 0)`}
                spellCheck={false}
              />
            </div>
            <div className="analyze-bar">
              <select value={lang} onChange={e => setLang(e.target.value)} className="lang-select">
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
              <button className="analyze-btn" onClick={analyze} disabled={loading}>
                {loading ? "⏳ Analyzing…" : "✨ Analyze Bug"}
              </button>
              <button className="ghost-btn" onClick={loadExample}>Load example</button>
            </div>
            {error && <div className="error-bar">⚠ {error}</div>}
          </section>

          {/* RIGHT — Results */}
          <section className="panel result-panel">
            <div className="panel-head"><span>Analysis</span></div>
            <div className="result-scroll">
              {!result && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">📡</div>
                  <p>Paste code or an error above, then hit Analyze Bug</p>
                </div>
              )}
              {loading && (
                <div className="loading-state">
                  <div className="spinner" />
                  Analyzing your code…
                </div>
              )}
              {result && (
                <>
                  <ResultSection icon="🐛" label="Bug explanation" color="red">
                    <p className="result-text">{result.explanation}</p>
                  </ResultSection>

                  <ResultSection icon="🔧" label="Suggested fix" color="green">
                    <pre className="code-fix">{result.fix}</pre>
                  </ResultSection>

                  <ResultSection icon="📖" label="Docs & references" color="blue">
                    {result.docs?.map((d, i) => (
                      <a key={i} href={d.url} target="_blank" rel="noreferrer" className="link-row">
                        <span className="link-title">{d.title}</span>
                        <span className="link-meta">{d.source}</span>
                        <span className="ext-icon">↗</span>
                      </a>
                    ))}
                  </ResultSection>

                  <ResultSection icon="📚" label="Similar on StackOverflow" color="amber">
                    {result.stackoverflow?.map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noreferrer" className="link-row">
                        <div>
                          <div className="link-title">{s.title}</div>
                          <div className="link-meta">{s.source}</div>
                        </div>
                        <span className={`votes ${s.votes > 500 ? "high" : ""}`}>▲ {s.votes}</span>
                      </a>
                    ))}
                  </ResultSection>
                </>
              )}
            </div>
          </section>
        </main>
      ) : (
        <div className="history-panel">
          <div className="panel-head">Recent sessions</div>
          {history.length === 0 && <div className="empty-state"><p>No history yet — analyze some code first!</p></div>}
          {history.map((h, i) => (
            <div key={i} className="hist-item" onClick={() => { setCode(h.code.replace("…","")); setLang(h.lang); setResult(h.result); setTab("analyze"); }}>
              <span className="hist-tag">{h.lang}</span>
              <span className="hist-text">{h.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultSection({ icon, label, color, children }) {
  return (
    <div className="result-section">
      <div className={`result-label label-${color}`}>{icon} {label}</div>
      {children}
    </div>
  );
}
