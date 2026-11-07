
import asyncio
import logging
from app.database.session import AsyncSessionLocal, engine, Base
from app.models import User, JobListing
from app.core.security import hash_password

# Configure logging for safe, structured console output
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_database() -> None:
    """
    Asynchronously initializes and seeds the database with secure demonstration data
    for offline portfolio execution and recruiter evaluation.
    """
    logger.info("Initializing database schema tables...")
    try:
        async with engine.begin() as conn:
            # Drop and recreate tables for deterministic clean local state
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database schema successfully created.")
    except Exception as e:
        logger.error(f"Failed to initialize database tables: {e}")
        raise

    logger.info("Seeding demonstration user profiles and job listings...")
    try:
        async with AsyncSessionLocal() as session:
            # Create securely hashed passwords using Bcrypt (no plain text storage)
            candidate_password = hash_password("SecureCandidatePassword123!")
            recruiter_password = hash_password("SecureRecruiterPassword123!")

            candidate = User(
                email="candidate@example.com",
                hashed_password=candidate_password,
                role="candidate",
                full_name="Alex Johnson",
            )
            
            recruiter = User(
                email="recruiter@example.com",
                hashed_password=recruiter_password,
                role="recruiter",
                full_name="Sarah Smith",
            )
            
            # Create sample job postings for TF-IDF vector matching tests
            job_1 = JobListing(
                title="Full Stack Software Engineer",
                company="TechCorp Solutions",
                description="Seeking a Full Stack Developer skilled in Python, FastAPI, React, PostgreSQL, and Docker container orchestration.",
                required_skills="python, fastapi, react, postgresql, docker, rest api",
            )
            
            job_2 = JobListing(
                title="Backend Python Developer",
                company="DataFlow Systems",
                description="Looking for an experienced Backend Engineer proficient in Python, SQL, RESTful API design, and asynchronous event loops.",
                required_skills="python, fastapi, sqlalchemy, postgresql, async, pytest",
            )

            session.add_all([candidate, recruiter, job_1, job_2])
            await session.commit()
            logger.info("Database successfully seeded with secure demo records.")
            
    except Exception as e:
        logger.error(f"An error occurred while seeding database records: {e}")
        raise
    finally:
        # Ensure proper engine disposal
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_database())
