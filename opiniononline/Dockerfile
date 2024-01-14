# syntax=docker/dockerfile:1

# Set the Node.js version as a build argument
ARG NODE_VERSION=18.14.2

# Use the specified Node.js version on the Alpine Linux distribution
FROM node:${NODE_VERSION}-alpine

# Set the environment variable for Node.js to production
ENV NODE_ENV production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Add the 'node' user to a new group 'testST' and set ownership of the working directory
RUN addgroup -S testST && adduser node testST && chown -R node:testST /usr/src/app

# Switch to the 'node' user
USER node

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a bind mount to package.json and package-lock.json to avoid having to copy them into
# this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci --omit=dev

# Copy the rest of the source files into the image
COPY . .

COPY .env /usr/src/app

# Expose the port that the application listens on
EXPOSE 3000

# Run the application
CMD npm start
