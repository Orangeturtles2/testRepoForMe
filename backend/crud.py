from sqlalchemy.orm import Session
import models
import schemas
import security

def get_user_by_username(db: Session, username: str):
    """
    New function to fetch a user by their username.
    """
    return db.query(models.User).filter(models.User.username == username).first()

def get_user(db: Session, user_id: str):
    """
    Get a user by their unique ID (UUID).
    """
    # Note: Ensure the user_id is being handled correctly as a UUID if needed,
    # but filtering by string comparison often works if the ID is passed as string.
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    """
    Create a new user. Assumes username uniqueness has already been checked.
    """
    db_user = models.User(
        username=user.username,
        password=security.hash_password(user.password),  # hash here
        linkedin_link=user.linkedin_link,
        interests=user.interests,
        skills=user.skills,
        major=user.major,
        preferences=user.preferences
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    """
    Authenticate a user by username and password.
    """
    user = get_user_by_username(db, username)  # Re-use our new function
    
    if not user:
        return False
    
    if not security.verify_password(password, user.password):
        return False
        
    return user

def get_all_users(db: Session):
    """
    Helper function to get all users (for the similarity endpoint).
    """
    return db.query(models.User).all()