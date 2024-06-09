# Use the official Node.js image with a specific version
FROM node:20.14.0

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies and run the postinstall script to install TypeScript globally
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

ENV MONGO_URI="mongodb+srv://raj:NwAXvGMLWpVGFIs2@cluster0.v1bry.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
ENV POSTGRES_HOST="localhost"
ENV POSTGRES_DB="raj"
ENV POSTGRES_USER="raj"
ENV POSTGRES_PASSWORD="raj"
ENV POSTGRES_PORT=5432

# Build the TypeScript code
RUN npm run build

# Set the environment variable for the port
ENV PORT 8080

# Expose the port the app runs on
EXPOSE 8080

# Start the application from the build output
CMD ["node", "dist/server.js"]
