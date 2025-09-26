FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json* pnpm-lock.yaml* ./
# Prefer pnpm if lockfile exists, else npm
RUN if [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i;     elif [ -f package-lock.json ]; then npm ci; else npm i; fi

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
