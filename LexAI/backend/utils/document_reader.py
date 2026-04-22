from PyPDF2 import PdfReader
from PIL import Image
import pytesseract
import re

def clean_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    text = text.replace('\x00', '')
    return text.strip()

def extract_text_from_pdf(path):
    reader = PdfReader(path)
    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + " "

    return clean_text(text)

def extract_text_from_image(path):
    image = Image.open(path)
    raw_text = pytesseract.image_to_string(image)
    return clean_text(raw_text)
