# Base image with Python and Node
FROM python:3.11-slim

# Install Node.js and build tools
RUN apt-get update && \
    apt-get install -y curl build-essential libpq-dev gcc && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Set working directory
WORKDIR /app

# -------------------
# Build frontend
# -------------------
COPY frontend/package*.json frontend/
RUN cd frontend && npm install

COPY frontend frontend
RUN cd frontend && npm run build

# -------------------
# Set up backend
# -------------------
COPY backend/requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend backend

# Expose a single port for Render
ENV PORT=8000
EXPOSE 8000

# -------------------
# CMD to run backend
# Serve React build via FastAPI static files
# -------------------
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}"]
