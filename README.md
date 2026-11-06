# AI-Powered Career Intelligence & Job Matching Platform

A full-stack, privacy-focused software engineering prototype designed to help candidates analyze resumes, 
evaluate semantic job fit, identify skill gaps, and explore targeted career growth paths locally.

> **Project Status:** ⚠️ **Local Developer Prototype Only**  
> This project is designed strictly as an offline-first software engineering portfolio
>  project for GitHub presentation, technical interviews, and recruiter evaluation.
>  It operates using deterministic local algorithms and standard vector mathematics without external cloud AI subscriptions or third-party telemetry.

---

## 📌 Project Overview

* **Project Name:** AI-Powered Career Intelligence & Job Matching Platform
* **Primary Focus:** Resume parsing, ATS keyword coverage estimation, local TF-IDF semantic job matching, skill-gap analysis, and recruiter directory management.
* **Architecture:** Decoupled Single-Page Application (SPA) frontend with an asynchronous RESTful backend and PostgreSQL/SQLite persistence.
* **Deployment Model:** 100% Offline-First (Local containerized setup via Docker Compose).

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend UI** | React.js (ES6+), Vite, Lucide React Icons, CSS3 |
| **Backend API** | Python, FastAPI, Pydantic v2, Uvicorn (ASGI) |
| **Matching & Analytics** | Scikit-Learn (TF-IDF Vectorization & Cosine Similarity), PyPDF |
| **Database & ORM** | Async SQLAlchemy, PostgreSQL, SQLite (Development fallback) |
| **Security & Auth** | OAuth2 Bearer Tokens, PyJWT, Passlib (Bcrypt hashing) |
| **DevOps & Containers** | Docker, Docker Compose, Git |

---

## 💡 Core Features

* **Local Resume Ingestion & Parsing:** Upload PDF, DOCX, or TXT resumes with strict payload size caps (5MB max) and local text extraction.
* **Semantic Compatibility Matching:** Calculates candidate-role fit using Scikit-Learn TF-IDF vector similarity metrics instead of simple keyword counting.
* **Skill-Gap Identification:** Automatically cross-references candidate skill matrices against target job profiles to highlight missing prerequisites.
* **Recruiter Directory View:** Interactive candidate overview allowing recruiters to evaluate applicant profiles and role suitability.

---

## 📁 Repository Directory Structure

```text
career-intelligence-platform/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── resume.py          # Resume upload & parsing endpoint
│   │   ├── core/
│   │   │   └── security.py        # JWT authentication & password hashing
│   │   ├── database/
│   │   │   └── session.py         # Async SQLAlchemy engine configuration
│   │   ├── main.py                # FastAPI lifecycle & global middlewares
│   │   ├── models.py              # Database ORM models
│   │   ├── schemas.py             # Pydantic validation schemas
│   │   └── seed.py                # Asynchronous database seed script
│   ├── Dockerfile                     # Backend container configuration
│   └── requirements.txt               # Backend Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Single-Page Dashboard component
│   │   ├── main.jsx               # React DOM root entry point
│   │   └── styles.css             # Local application styles
│   ├── Dockerfile                     # Frontend container configuration
│   ├── index.html                     # Main HTML template
│   ├── package.json                   # React project dependencies
│   ├── package-lock.json              # Dependency lockfile
│   └── vite.config.js                 # Vite build server config
├── docker-compose.yml                 # Local multi-service orchestration
├── .gitignore                         # Excluded folders (node_modules, venv, caches)
└── README.md                          # Repository documentation

