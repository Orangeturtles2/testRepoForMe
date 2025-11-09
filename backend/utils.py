from sentence_transformers import SentenceTransformer, util
import os


# Similarities

# Disable Hugging Face warnings
os.environ["TRANSFORMERS_NO_ADVISORY_WARNINGS"] = "true"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "true"

model = SentenceTransformer('all-MiniLM-L6-v2')


def flatten_user(user) -> str:
  """
  Turn a user (Pydantic model or SQLAlchemy model) into a single string
  for embedding. We accept either a Pydantic `UserRead` (which has
  `model_dump`) or a SQLAlchemy model instance (which has `__dict__`).
  """
  components = []
  excluded_fields = {'id', 'social', 'username', 'password'}

  # Try Pydantic-style extraction first
  items = None
  if hasattr(user, 'model_dump'):
    try:
      items = user.model_dump().items()
    except Exception:
      items = None

  # Fall back to SQLAlchemy model __dict__
  if items is None:
    if hasattr(user, '__dict__'):
      items = ((k, v) for k, v in user.__dict__.items() if not k.startswith('_'))
    else:
      items = []

  for key, value in items:
    if key in excluded_fields:
      continue
    if isinstance(value, list):
      components.extend([str(x) for x in value])
    elif isinstance(value, str):
      components.append(value)
    elif value is not None:
      components.append(str(value))

  return " ".join(components)


def get_similarity(inputUser, db_users: list) -> dict:
  # Get all users that aren't the input user
  other_users = [user for user in db_users if getattr(user, 'id', None) != getattr(inputUser, 'id', None)]

  input_text = flatten_user(inputUser)
  users_text = [flatten_user(user) for user in other_users]

  input_embedding = model.encode(input_text, convert_to_tensor=True)
  user_embeddings = model.encode(users_text, convert_to_tensor=True)

  similarities = util.cos_sim(input_embedding, user_embeddings).flatten()
  d = {}
  for user, sim in zip(other_users, similarities):
    # Ensure keys are strings (JSON-friendly)
    d[str(getattr(user, 'id'))] = float(sim)
  return d