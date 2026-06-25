const express = require('express');
const app = express();

app.use(express.json());

let todos = [];
let nextId = 1;

// Todo一覧を取得
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Todoを新規作成
app.post('/todos', (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  const todo = {
    id: nextId++,
    title,
    completed: false,
  };

  todos.push(todo);
  res.status(201).json(todo);
});

// Todoの完了状態を更新
app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (req.body.completed === undefined) {
    return res.status(400).json({ error: 'completed is required' });
  }

  todo.completed = req.body.completed;
  res.json(todo);
});

// Todoを削除
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(index, 1);
  res.status(204).send();
});

// テスト用にデータをリセットする関数をエクスポート
app.resetTodos = () => {
  todos = [];
  nextId = 1;
};

module.exports = app;
