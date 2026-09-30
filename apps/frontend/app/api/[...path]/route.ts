import type { NextRequest } from 'next/server';
import { getBackendUrl } from '@/lib/backend';

// Прокси: браузер ходит на /api/* фронтенда, а Next.js пересылает запрос на бэкенд.
// Так не нужен CORS и адрес бэкенда не попадает в клиентский бандл.
async function proxy(req: NextRequest, ctx: RouteContext<'/api/[...path]'>) {
  const { path } = await ctx.params;
  const target = `${getBackendUrl()}/api/${path.join('/')}${req.nextUrl.search}`;

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';

  try {
    const res = await fetch(target, {
      method: req.method,
      headers: { 'content-type': req.headers.get('content-type') ?? 'application/json' },
      body: hasBody ? await req.text() : undefined,
      cache: 'no-store',
    });

    return new Response(res.status === 204 ? null : await res.text(), {
      status: res.status,
      headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
    });
  } catch {
    return Response.json({ message: 'Backend is unavailable' }, { status: 502 });
  }
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as DELETE };
