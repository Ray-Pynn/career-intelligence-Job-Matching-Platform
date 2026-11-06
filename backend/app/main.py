
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from app.api.routes import resume
from app.database.session import engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Application Startup lifecycle logic
    yield
    # Application Shutdown lifecycle logic: clean up database connections safely
    await engine.dispose()

app = FastAPI(
    title="AI-Powered Career Intelligence Platform API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# 1. Network Security: Restrict CORS strictly to local development client origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# 2. Host Header Protection: Prevent HTTP Host Header poisoning attacks
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.test"],
)

# Include API Router modules
app.include_router(resume.router, prefix="/api/v1")

@app.get("/healthz", status_code=status.HTTP_200_OK)
async def health_check():
    """Health check endpoint for container health probes and local monitoring."""
    return {"status": "ok", "mode": "offline-prototype"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler to prevent internal server details or stack traces from leaking."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected internal server error occurred. Please try again later."},
    )
  
