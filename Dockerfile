FROM node:20.14.0-bookworm

COPY . ./api

WORKDIR /api

# RUN npm install -g pnpm

# COPY package.json pnpm-lock.yaml* ./

RUN npm install

# COPY .eslintrc.cjs ./

# COPY tsconfig.json ./

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

