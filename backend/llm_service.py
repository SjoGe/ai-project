import json
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

genai.configure(api_key=api_key)
model = genai.GenerativeModel(model_name)


def summarize_notes(notes: str) -> str:
    prompt = f"""
    You are a helpful study assistant.
    Summarize the following study notes clearly and briefly.

    Notes:
    {notes}
    """

    response = model.generate_content(prompt)
    return response.text


def ask_about_notes(notes: str, question: str) -> str:
    prompt = f"""
    You are a helpful study assistant.
    Answer the user's question using only the study notes below.
    If the answer is not found in the notes, say that clearly.

    Notes:
    {notes}

    Question:
    {question}
    """

    response = model.generate_content(prompt)
    return response.text


def generate_quiz(notes: str, difficulty: str = "medium", count: int = 5):
    prompt = f"""
You are a quiz generator.

Based only on the study notes below, create {count} quiz questions.
Difficulty level: {difficulty}.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations.
Do not include code fences.

Use exactly this format:
{{
  "questions": [
    {{
      "question": "string",
      "answer": "string"
    }}
  ]
}}

Study notes:
{notes}
"""

    response = model.generate_content(prompt)

    if not hasattr(response, "text") or not response.text:
        raise ValueError("Gemini returned an empty response.")

    text = response.text.strip()

    text = text.replace("```json", "").replace("```", "").strip()

    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1:
        raise ValueError(f"No JSON object found in response: {text}")

    json_text = text[start:end + 1]

    try:
        parsed = json.loads(json_text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON returned by model: {e}\nRaw response: {text}")

    if "questions" not in parsed:
        raise ValueError(f"Response missing 'questions': {parsed}")

    if not isinstance(parsed["questions"], list):
        raise ValueError("'questions' must be a list")

    return parsed