# Base image with Python and Node
FROM python:3.11-slim

# Install Node.js
RUN apt-get update && \
    apt-get install -y curl build-essential && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Install supervisor
RUN apt-get install -y supervisor

# Set working directories
WORKDIR /app

# Copy backend first
COPY backend /app/backend
WORKDIR /app/backend

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend
COPY frontend /app/frontend
WORKDIR /app/frontend

# Install frontend dependencies
RUN npm install

# Copy supervisord config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 8000 3000

# Start supervisor
CMD ["/usr/bin/supervisord"]
