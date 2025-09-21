FROM node:20

RUN npm install -g pnpm

RUN mkdir -p /api

COPY package.json /api

COPY /src/ /api/src

COPY /drizzle/ /api/drizzle

COPY .eslintrc.cjs /api/eslintrc.cjs

COPY tsconfig.json /api/tsconfig.json

WORKDIR /api

RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]
