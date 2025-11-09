from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
import crud
from db import engine, get_db
import utils  # Assuming you need this for get_similar_users

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/users/", response_model=schemas.UserRead, status_code=201)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user.
    """
    # --- THIS IS THE FIX ---
    # First, check if a user with this username already exists
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        # If they do, raise a specific 400 error
        raise HTTPException(status_code=400, detail="Username already registered")
    # -----------------------
    
    # Now, try to create the user
    # Any error here is likely an internal server issue, not bad input
    try:
        return crud.create_user(db, user)
    except Exception as e:
        # Catch other internal errors
        print(f"Error creating user: {e}") # Good for logging
        raise HTTPException(status_code=500, detail="An internal error occurred.")

@app.get("/users/{user_id}", response_model=schemas.UserRead)
def read_user(user_id: str, db: Session = Depends(get_db)):
    """
    Get a specific user by their ID.
    """
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user_id": str(db_user.id)}

@app.get("/hello")
def hello():
    """
    A simple test endpoint.
    """
    return {"msg": "Hello world"}

@app.get("/users/{user_id}/similar")
def get_similar_users(user_id: str, db: Session = Depends(get_db)):
    """
    Find users with similar profiles.
    """
    db_users = crud.get_all_users(db)
    
    input_user = next((u for u in db_users if str(u.id) == user_id), None)
    if not input_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Make sure utils.get_similarity is correctly imported and used
    similarities = utils.get_similarity(input_user, db_users)
    
    # Filter similarities over 50% (0.5)
    filtered = {uid: sim for uid, sim in similarities.items() if sim > 0.5}
    
    return {"similar_users": filtered}