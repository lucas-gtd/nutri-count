FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV API_URL=http://server:3001

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
