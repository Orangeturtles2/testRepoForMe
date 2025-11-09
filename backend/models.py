from sqlalchemy import Column, String, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    linkedin_link = Column(String, nullable=False)
    interests = Column(JSON, nullable=False)
    skills = Column(JSON, nullable=False)
    major = Column(String, nullable=False)        # store as JSON array
    preferences = Column(JSON, nullable=False)   # store as JSON array
