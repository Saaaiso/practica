# Этап 1: сборка Vite-приложения
FROM node:20-alpine AS build
WORKDIR /app

# Копируем только package.json + lockfile сначала (для лучшего кэширования)
COPY package*.json ./
RUN npm ci --production=false

# Копируем весь код
COPY . .

# Собираем проект
RUN npm run build -- --mode=production

# Этап 2: nginx
FROM nginx:alpine AS final

# Копируем собранные файлы
COPY --from=build /app/dist /usr/share/nginx/html

# Конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80