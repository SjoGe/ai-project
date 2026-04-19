from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llm_service import summarize_notes, ask_about_notes, generate_quiz
from docx import Document
import io

def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory session storage
session_data = {
    "notes": ""
}


class NotesRequest(BaseModel):
    notes: str


class AskRequest(BaseModel):
    question: str


class QuizRequest(BaseModel):
    difficulty: str = "medium"
    count: int = 5


@app.get("/")
def root():
    return {"message": "Study AI backend is running"}


@app.post("/set-notes")
def set_notes(data: NotesRequest):
    session_data["notes"] = data.notes
    return {"message": "Notes saved successfully"}


@app.get("/get-notes")
def get_notes():
    return {"notes": session_data["notes"]}


@app.post("/upload-docx")
async def upload_docx(file: UploadFile = File(...)):
    if not file.filename.endswith(".docx"):
        return {"error": "Only .docx files are supported"}

    file_bytes = await file.read()
    text = extract_text_from_docx(file_bytes)

    if not text.strip():
        return {"error": "No readable text found in the document"}

    session_data["notes"] = text

    return {
        "message": "Document uploaded successfully",
        "filename": file.filename,
        "text": text
    }


@app.post("/summarize")
def summarize():
    notes = session_data["notes"]

    if not notes.strip():
        return {"error": "No notes saved yet"}

    try:
        result = summarize_notes(notes)
        return {"summary": result}
    except Exception as e:
        print("Summarize error:", repr(e))
        return {"error": str(e)}


@app.post("/ask")
def ask_question(data: AskRequest):
    notes = session_data["notes"]

    if not notes.strip():
        return {"error": "No notes saved yet"}

    result = ask_about_notes(notes, data.question)
    return {"answer": result}


@app.post("/generate-quiz")
def create_quiz(data: QuizRequest):
    notes = session_data["notes"]

    if not notes.strip():
        return {"error": "No notes saved yet"}

    try:
        quiz = generate_quiz(notes, data.difficulty, data.count)
        return quiz
    except Exception as e:
        print("Quiz error:", repr(e))
        return {"error": str(e)}


@app.post("/reset")
def reset_session():
    session_data["notes"] = ""
    return {"message": "Session reset successfully"}
