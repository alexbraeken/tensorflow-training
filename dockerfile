# Dockerfile
FROM node:18-slim
WORKDIR /app
COPY . .
RUN npm install --production
CMD ["node", "bot/app.js"]