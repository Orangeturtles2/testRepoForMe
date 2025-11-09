from pydantic import BaseModel, Field, validator
from typing import List
from uuid import UUID, uuid4

class UserCreate(BaseModel):
    username: str
    password: str
    linkedin_link: str
    interests: List[str]
    skills: List[str]
    major: str
    preferences: List[str]

    # Split space-separated strings into lists
    @validator('interests', 'skills', 'preferences', pre=True)
    def split_strings(cls, v):
        if isinstance(v, str):
            return v.split()  # splits by whitespace
        return v

class UserRead(UserCreate):
    id: UUID = Field(default_factory=uuid4)

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username: str
    password: str