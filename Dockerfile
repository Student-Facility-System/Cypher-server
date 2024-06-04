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

# Build the TypeScript code
RUN npm run build

# Set the environment variable for the port
ENV PORT 3001

# Expose the port the app runs on
EXPOSE 3001

# Start the application from the build output
CMD ["node", "dist/server.js"]
