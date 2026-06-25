const request = require('supertest');
const app = require('./app');

beforeEach(() => {
  app.resetTodos();
});

describe('GET /todos', () => {
  test('空の配列を返す', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('作成済みのTodoを返す', async () => {
    await request(app).post('/todos').send({ title: 'テスト1' });
    await request(app).post('/todos').send({ title: 'テスト2' });

    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('POST /todos', () => {
  test('新しいTodoを作成する', async () => {
    const res = await request(app).post('/todos').send({ title: '買い物' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 1,
      title: '買い物',
      completed: false,
    });
  });

  test('titleがない場合は400を返す', async () => {
    const res = await request(app).post('/todos').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('title is required');
  });

  test('IDが自動的にインクリメントされる', async () => {
    const res1 = await request(app).post('/todos').send({ title: 'タスク1' });
    const res2 = await request(app).post('/todos').send({ title: 'タスク2' });
    expect(res1.body.id).toBe(1);
    expect(res2.body.id).toBe(2);
  });
});

describe('PATCH /todos/:id', () => {
  test('Todoの完了状態を更新する', async () => {
    await request(app).post('/todos').send({ title: 'テスト' });

    const res = await request(app).patch('/todos/1').send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
    expect(res.body.title).toBe('テスト');
  });

  test('存在しないTodoの場合は404を返す', async () => {
    const res = await request(app).patch('/todos/999').send({ completed: true });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Todo not found');
  });

  test('completedが未指定の場合は400を返す', async () => {
    await request(app).post('/todos').send({ title: 'テスト' });

    const res = await request(app).patch('/todos/1').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('completed is required');
  });

  test('完了状態をfalseに戻せる', async () => {
    await request(app).post('/todos').send({ title: 'テスト' });
    await request(app).patch('/todos/1').send({ completed: true });

    const res = await request(app).patch('/todos/1').send({ completed: false });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(false);
  });
});

describe('DELETE /todos/:id', () => {
  test('Todoを削除する', async () => {
    await request(app).post('/todos').send({ title: 'テスト' });

    const res = await request(app).delete('/todos/1');
    expect(res.status).toBe(204);

    const listRes = await request(app).get('/todos');
    expect(listRes.body).toHaveLength(0);
  });

  test('存在しないTodoの場合は404を返す', async () => {
    const res = await request(app).delete('/todos/999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Todo not found');
  });

  test('削除後に他のTodoが残っている', async () => {
    await request(app).post('/todos').send({ title: 'タスク1' });
    await request(app).post('/todos').send({ title: 'タスク2' });

    await request(app).delete('/todos/1');

    const listRes = await request(app).get('/todos');
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].title).toBe('タスク2');
  });
});
