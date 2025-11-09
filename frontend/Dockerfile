FROM node:22

WORKDIR /app

# Copy package.json first for caching
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose React port
EXPOSE 3000

# Start React
CMD ["npm", "start"]