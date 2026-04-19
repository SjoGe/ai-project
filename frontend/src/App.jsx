import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [notes, setNotes] = useState("");
  const [question, setQuestion] = useState("");
  const [summary, setSummary] = useState("");
  const [answer, setAnswer] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
  document.title = "StudyMate AI";
}, []);

  const saveNotes = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_BASE}/set-notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();
      setMessage(data.message || "Notes saved.");
    } catch (error) {
      setMessage("Failed to save notes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const summarizeNotes = async () => {
    setLoading(true);
    setSummary("");
    try {
      const response = await fetch(`${API_BASE}/summarize`, {
        method: "POST",
      });

      const data = await response.json();
      setSummary(data.summary || data.error || "No summary returned.");
    } catch (error) {
      setSummary("Failed to summarize notes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setAnswer(data.answer || data.error || "No answer returned.");
    } catch (error) {
      setAnswer("Failed to ask question.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    setLoading(true);
    setQuiz([]);
    try {
      const response = await fetch(`${API_BASE}/generate-quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          difficulty,
          count: 5,
        }),
      });

      const data = await response.json();
      setQuiz(data.questions || []);
      if (!data.questions && data.error) {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Failed to generate quiz.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetSession = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/reset`, {
        method: "POST",
      });

      setNotes("");
      setQuestion("");
      setSummary("");
      setAnswer("");
      setQuiz([]);
      setMessage("Session reset.");
    } catch (error) {
      setMessage("Failed to reset session.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocx = async () => {
  if (!selectedFile) {
    setMessage("Please choose a .docx file first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);

  setLoading(true);
  setMessage("");

  try {
    const response = await fetch(`${API_BASE}/upload-docx`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      setMessage(data.error);
    } else {
      setMessage(data.message);
      setNotes(data.text || "");
    }
  } catch (error) {
    console.error(error);
    setMessage("File upload failed.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container">
      <h1>StudyMate AI</h1>
      <p className="subtitle">
        Paste your study notes and use AI to summarize, ask questions, and generate quizzes.
      </p>

      <div className="card">
        <h2>Study Notes</h2>

        <input
        type="file"
        accept=".docx"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        <button onClick={uploadDocx} disabled={loading}>
          Upload word file
        </button>

        <textarea
          rows="10"
          placeholder="Paste your study notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="buttonRow">
          <button onClick={saveNotes} disabled={loading}>
            Save Notes
          </button>
          <button onClick={summarizeNotes} disabled={loading}>
            Summarize
          </button>
          <button onClick={resetSession} disabled={loading}>
            Reset
          </button>
        </div>

        {message && <p className="message">{message}</p>}
      </div>

      <div className="card">
        <h2>Ask a Question</h2>
        <input
          type="text"
          placeholder="Ask something about your notes..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={askQuestion} disabled={loading}>
          Ask
        </button>

        {answer && (
          <div className="outputBox">
            <h3>Answer</h3>
            <p>{answer}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Generate Quiz</h2>
        <label htmlFor="difficulty">Difficulty</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button onClick={generateQuiz} disabled={loading}>
          Generate Quiz
        </button>

        {quiz.length > 0 && (
          <div className="outputBox">
            <h3>Quiz Questions</h3>
            {quiz.map((item, index) => (
              <div key={index} className="quizItem">
                <p>
                  <strong>Q{index + 1}:</strong> {item.question}
                </p>
                <p>
                  <strong>Answer:</strong> {item.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {summary && (
        <div className="card">
          <div className="outputBox">
            <h3>Summary</h3>
            <p>{summary}</p>
          </div>
        </div>
      )}

      {loading && <p className="loading">Loading...</p>}
    </div>
  );
}

export default App;