
import asyncio
import io
from typing import List
import pypdf
from fastapi import APIRouter, File, HTTPException, UploadFile, status
from pydantic import BaseModel

router = APIRouter(prefix="/resumes", tags=["Resumes"])

# Enforce strict 5MB payload limit to prevent memory exhaustion
MAX_FILE_SIZE = 5 * 1024 * 1024

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}


class ResumeAnalysisResponse(BaseModel):
    filename: str
    extracted_text_length: int
    extracted_skills: List[str]


def _parse_pdf_bytes(contents: bytes) -> str:
    """Safely extracts text from PDF byte content in a separate thread."""
    try:
        pdf_file = io.BytesIO(contents)
        reader = pypdf.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
        return text
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Could not parse PDF file safely: {str(e)}",
        )


@router.post("/upload", response_model=ResumeAnalysisResponse)
async def upload_resume(file: UploadFile = File(...)):
    """Handles resume uploads, validates payload rules, and extracts skills safely."""

    # 1. Validate MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF (.pdf), DOCX (.docx), and TXT (.txt) files are accepted.",
        )

    # 2. Read contents and validate file size limits
    contents = await file.read()

    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds maximum permitted limit of 5MB.",
        )

    # 3. Offload CPU-heavy text extraction off the main async event loop
    if file.content_type == "application/pdf":
        extracted_text = await asyncio.to_thread(_parse_pdf_bytes, contents)
    else:
        extracted_text = contents.decode("utf-8", errors="ignore")

    # 4. Extract skills locally using heuristic keyword validation
    skill_keywords = [
        "python",
        "fastapi",
        "react",
        "postgresql",
        "docker",
        "aws",
        "sql",
        "javascript",
        "git",
        "css",
        "html",
        "rest api",
    ]
    lowered_text = extracted_text.lower()
    found_skills = [
        skill for skill in skill_keywords if skill in lowered_text
    ]

    return ResumeAnalysisResponse(
        filename=file.filename or "uploaded_resume",
        extracted_text_length=len(extracted_text),
        extracted_skills=found_skills,
    )
