FROM cypress/base:12.1.0

RUN mkdir /app
WORKDIR /app

COPY package.json .
RUN npm install
COPY . .

RUN ["npm", "run", "cy:run:all"]