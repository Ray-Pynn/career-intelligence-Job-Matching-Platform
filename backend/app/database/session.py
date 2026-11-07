
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
import os

# Uses async SQLite for local offline development, or PostgreSQL when configured via Docker
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./career_platform.db")

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency generator that yields an async database session 
    and ensures it is safely closed after the request completes."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
