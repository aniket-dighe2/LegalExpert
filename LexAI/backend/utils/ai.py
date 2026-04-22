def ask_ai(document_text: str, question: str):
    if not document_text.strip():
        return "No document content found to analyze."

    # very simple logic for demo
    return f"""
Based on the uploaded document, here is the response:

Question:
{question}

Answer:
The document contains information related to your question. 
Key points from the document were analyzed to generate this response.
"""
