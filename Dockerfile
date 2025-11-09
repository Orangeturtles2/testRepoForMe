# -------------------------------
# Base image with Python + Node
# -------------------------------
FROM python:3.11-slim

# Install Node.js and build tools
RUN apt-get update && \
    apt-get install -y curl build-essential libpq-dev gcc && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Set working directory
WORKDIR /app

# -------------------------------
# Copy backend first
# -------------------------------
COPY backend/requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend backend

# Set PYTHONPATH so Python finds your backend modules
ENV PYTHONPATH=/app/backend

# -------------------------------
# Build frontend
# -------------------------------
COPY frontend/package*.json frontend/
RUN cd frontend && npm install

COPY frontend frontend
RUN cd frontend && npm run build

# -------------------------------
# Expose port
# -------------------------------
ENV PORT=8000
EXPOSE 8000

# -------------------------------
# Run backend (serving frontend build)
# -------------------------------
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
