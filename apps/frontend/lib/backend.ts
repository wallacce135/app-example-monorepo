// Адрес бэкенда читается в рантайме на сервере Next.js,
// поэтому его можно менять без пересборки фронтенда.
export function getBackendUrl(): string {
  return (process.env.BACKEND_URL ?? 'http://localhost:4000').replace(/\/$/, '');
}

export type Todo = {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
};

export type Health = {
  status: string;
  uptime: number;
  node: string;
  timestamp: string;
};
