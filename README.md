# Monorepo Example (Next.js + NestJS)

Пример монорепозитория для **Timeweb Cloud Apps**: фронтенд на [Next.js](https://nextjs.org/) и бэкенд на [NestJS](https://nestjs.com/), оба на Node.js. Монорепо собрано на npm workspaces.

:rocket: [Создать свой Apps](https://timeweb.cloud/my/apps/create)

:books: [Документация Timeweb Cloud Apps](https://timeweb.cloud/docs/apps)

## Структура

```
apps/
├── backend/    # NestJS 12, порт 4000, все роуты под префиксом /api
└── frontend/   # Next.js 16 (App Router), порт 3000
```

## API бэкенда

| Метод  | Путь                    | Описание                         |
| ------ | ----------------------- | -------------------------------- |
| GET    | `/api/health`           | статус, uptime, версия Node.js   |
| GET    | `/api/todos`            | список задач                     |
| POST   | `/api/todos`            | создать задачу `{ "title": "…" }` |
| PATCH  | `/api/todos/:id/toggle` | переключить `done`               |
| DELETE | `/api/todos/:id`        | удалить задачу                   |

Задачи хранятся в памяти и сбрасываются при перезапуске.

## Как фронтенд ходит на бэкенд

- **SSR:** главная страница на сервере запрашивает `GET /api/health` и показывает статус.
- **Из браузера:** список задач запрашивается через `/api/*` фронтенда. Роут `app/api/[...path]/route.ts` проксирует запросы на бэкенд, поэтому CORS не нужен.

Адрес бэкенда задаётся переменной `BACKEND_URL` (по умолчанию `http://localhost:4000`). Next.js читает её в рантайме, так что пересобирать фронтенд после смены адреса не нужно.

## <a name="dev"></a>Локальный запуск

```bash
# установка зависимостей для всех пакетов
npm install

# запуск фронтенда и бэкенда в dev-режиме
npm run dev

# сборка обоих пакетов
npm run build

# запуск собранных пакетов (каждый в своём терминале)
npm run start:backend
npm run start:frontend
```

Фронтенд: http://localhost:3000, бэкенд: http://localhost:4000/api/health.

## Переменные окружения

| Пакет    | Переменная    | По умолчанию            |
| -------- | ------------- | ----------------------- |
| backend  | `PORT`        | `4000`                  |
| frontend | `PORT`        | `3000`                  |
| frontend | `BACKEND_URL` | `http://localhost:4000` |
