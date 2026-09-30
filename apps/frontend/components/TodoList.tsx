'use client';

import { type FormEvent, useEffect, useState } from 'react';
import type { Todo } from '@/lib/backend';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('test change');

  useEffect(() => {
    request<Todo[]>('/api/todos')
      .then(setTodos)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    try {
      const todo = await request<Todo>('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title }),
      });
      setTodos((prev) => [...prev, todo]);
      setTitle('');
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleToggle(id: number) {
    try {
      const updated = await request<Todo>(`/api/todos/${id}/toggle`, { method: 'PATCH' });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleDelete(id: number) {
    try {
      await request<void>(`/api/todos/${id}`, { method: 'DELETE' });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="todos">
      <form className="todos__form" onSubmit={handleAdd}>
        <input
          className="todos__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Новая задача"
        />
        <button className="todos__button" type="submit">
          Добавить
        </button>
      </form>

      {error && <p className="todos__error">{error}</p>}
      {loading && <p className="todos__empty">Загрузка…</p>}
      {!loading && todos.length === 0 && <p className="todos__empty">Задач пока нет</p>}

      <ul className="todos__list">
        {todos.map((todo) => (
          <li key={todo.id} className={`todos__item${todo.done ? ' todos__item--isDone' : ''}`}>
            <label className="todos__label">
              <input type="checkbox" checked={todo.done} onChange={() => handleToggle(todo.id)} />
              <span>{todo.title}</span>
            </label>
            <button
              className="todos__delete"
              type="button"
              onClick={() => handleDelete(todo.id)}
              aria-label="Удалить"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
