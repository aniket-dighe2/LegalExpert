from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Body

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from db import Base, engine, SessionLocal
from user_model import User
from auth_utils import hash_password, verify_password
from sqlalchemy import text
import shutil
from utils.document_reader import extract_text_from_pdf, extract_text_from_image
from google import genai
from dotenv import load_dotenv
load_dotenv()
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing")


from google import genai

def call_gemini(prompt: str) -> str:
    client = genai.Client(api_key=GEMINI_API_KEY)

    response = client.models.generate_content(
        model="models/gemini-flash-latest",
        contents=prompt
    )

    return response.text





# ================= APP =================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ================= DATABASE =================
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================= AI MEMORY =================
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
def get_user_vector_db(user_id: int):
    return Chroma(
        persist_directory=f"chroma_db/user_{user_id}",
        embedding_function=embeddings
    )



# ================= SCHEMAS =================
class TextData(BaseModel):
    text: str
    user_id: int


class Question(BaseModel):
    question: str
    user_id: int


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# ================= ROUTES =================

@app.post("/upload-text")
def upload_text(data: TextData):
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(data.text)
    vector_db = get_user_vector_db(data.user_id)
    vector_db.add_texts(chunks)
    return {"message": "Stored successfully"}

@app.post("/ask")
def ask_question(data: Question):
    vector_db = get_user_vector_db(data.user_id)
    docs = vector_db.similarity_search(data.question, k=3)

    if not docs:
        return {"answer": "I don't know"}

    context = "\n".join(doc.page_content for doc in docs)

    prompt = f"""
You are a legal AI assistant.

Answer ONLY using the context below.
If the answer is not in the context, say "I don't know".

Context:
{context}

Question:
{data.question}
"""

    answer = call_gemini(prompt)
    return {"answer": answer}




@app.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "Signup successful"}

@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # 1. Find user by email
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # 2. Verify password
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # 3. Success
    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "File uploaded successfully",
        "filename": file.filename
    }


@app.post("/upload-and-index")
async def upload_and_index(filename: str = Body(...), user_id: int = Body(...)):
    file_path = f"uploads/{filename}"

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # Extract text
    if filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file_path)

    elif filename.lower().endswith((".png", ".jpg", ".jpeg")):
        text = extract_text_from_image(file_path)

    else:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

    # Split + store in vector DB
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.split_text(text)
    vector_db = get_user_vector_db(user_id)
    vector_db.add_texts(chunks)

    return {"message": "Document indexed successfully"}


@app.get("/")
def home():
    return {"msg": "LexAI backend running"}

   

@app.get("/db-test")
def db_test():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"message": "Database connected"}
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/test-gemini")
def test_gemini():
    try:
        reply = call_gemini("Say hello in one sentence")
        return {"reply": reply}
    except Exception as e:
        return {"error": str(e)}






