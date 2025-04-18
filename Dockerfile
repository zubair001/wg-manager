# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the source code
COPY . .

# Expose port
EXPOSE 5173

# Start app
CMD ["npm", "run", "dev"]
