# StudyMate AI

## 1. Project Description

StudyMate AI is a web application that helps students study using AI. The idea is simple: you can paste your notes or upload a Word (.docx) file, and the app will use AI to understand the content.

With the app, you can:
- get a summary of your notes
- ask questions about the content
- generate quiz questions to test yourself

The goal of the project is to make studying easier and more interactive.

---

## 2. Architecture Overview

The app is built using a simple full-stack structure:

React (Frontend) → FastAPI (Backend) → Gemini API (AI)

- The frontend (React) handles the user interface.
- The backend (FastAPI) processes requests and handles logic.
- The Gemini API is used for all AI features.

The frontend sends requests to the backend, and the backend sends prompts to the AI and returns the results.

---

## 3. Technical Choices

### Frontend
- React + Vite  
  Used because it is fast and easy to work with for building UI.

### Backend
- FastAPI  
  Chosen because it is simple and good for building APIs quickly.

- Pydantic  
  Used for validating incoming data.

- python-docx  
  Used to read text from uploaded Word files.

- python-dotenv  
  Used to safely store the API key.

### AI
- Google Gemini API  
  Used to generate summaries, answers, and quiz questions.

Gemini was chosen because it is easy to use and has a free tier.

---

## 4. Setup and Running Instructions

### Clone the project

```bash
git clone <your-repo-url>
cd study-ai-app
```

### Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a .env file:

```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Run backend:

```bash
uvicorn main:app --reload
```

---

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open the app:

http://localhost:5173

---

## 5. Known Limitations

- Notes are only stored in memory (they reset when backend restarts)
- Only .docx and .txt files are supported
- AI output is sometimes inconsistent (especially quiz format)
- No login system or database
- UI is basic and not production-level

---

## 6. AI Tools Used

This project was built with help from AI tools:

- ChatGPT  
  Used for help with coding, debugging, and understanding how to connect everything together.

AI tools were used as support, but the implementation and structure of the app were done by the developer.
