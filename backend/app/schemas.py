
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List

# ==========================================
# Authentication & Token Schemas
# ==========================================

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long.")

# ==========================================
# User Registration & Profile Schemas
# ==========================================

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters.")
    full_name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(default="candidate", description="User role: 'candidate' or 'recruiter'")

    @field_validator('role')
    @classmethod
    def validate_role(cls, v: str) -> str:
        allowed_roles = {"candidate", "recruiter"}
        v_lower = v.lower().strip()
        if v_lower not in allowed_roles:
            raise ValueError(f"Invalid role. Must be one of: {allowed_roles}")
        return v_lower

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str

    class Config:
        from_attributes = True

# ==========================================
# Resume & Job Matching Schemas
# ==========================================

class ResumeUploadResponse(BaseModel):
    filename: str
    extracted_text_length: int
    extracted_skills: List[str]
    ats_score: Optional[str] = "N/A"

class JobMatchRequest(BaseModel):
    resume_text: str = Field(..., min_string_length=10, description="Raw text extracted from resume")
    job_description: str = Field(..., min_string_length=10, description="Target job description")
    candidate_skills: List[str] = Field(default_factory=list)
    required_skills: List[str] = Field(default_factory=list)

class JobMatchResponse(BaseModel):
    composite_score: float
    semantic_similarity_score: float
    skill_coverage_pct: float
    matched_skills: List[str]
    missing_skills: List[str]
  
