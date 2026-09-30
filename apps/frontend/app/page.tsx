import { TodoList } from '@/components/TodoList';
import { getBackendUrl, type Health } from '@/lib/backend';

// Рендерим на каждый запрос, чтобы статус бэкенда был актуальным
export const dynamic = 'force-dynamic';

async function getHealth(): Promise<Health | null> {
  try {
    const res = await fetch(`${getBackendUrl()}/api/health`, { cache: 'no-store' });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const health = await getHealth();

  return (
    <main className="page">
      <h1 className="page__title">Next.js + NestJS</h1>
      <p className="page__subtitle">Пример монорепозитория для Timeweb Cloud Apps</p>

      <section className="card">
        <h2 className="card__title">Статус бэкенда (SSR)</h2>
        {health ? (
          <dl className="health">
            <dt>status</dt>
            <dd className="health__ok">{health.status}</dd>
            <dt>uptime</dt>
            <dd>{health.uptime} s</dd>
            <dt>node</dt>
            <dd>{health.node}</dd>
            <dt>timestamp</dt>
            <dd>{health.timestamp}</dd>
          </dl>
        ) : (
          <p className="health__error">Бэкенд недоступен по адресу {getBackendUrl()}</p>
        )}
      </section>

      <section className="card">
        <h2 className="card__title">Задачи (запросы из браузера)</h2>
        <TodoList />
      </section>
    </main>
  );
}
