FROM cypress/base:12.1.0

WORKDIR /app

COPY package.json .
RUN npm install --save-dev cypress
COPY . .

RUN ["npx", "cypress", "verify"]