# Configure
FROM node:16-alpine
WORKDIR /app
COPY . .

# Build
RUN npm ci
RUN npm run build

# Install concurrently globally
RUN npm install -g concurrently

# Run
ENV NODE_ENV production
EXPOSE 3000
EXPOSE 5000

CMD [ "concurrently", "npx serve build", "node server/server.js" ]