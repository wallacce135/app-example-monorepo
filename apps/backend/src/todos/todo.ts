export class Todo {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

export class CreateTodoDto {
  title?: unknown;
}
