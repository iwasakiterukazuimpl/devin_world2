const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.hidden = false;
  setTimeout(() => { errorMessage.hidden = true; }, 3000);
}

async function fetchTodos() {
  try {
    const res = await fetch('/todos');
    if (!res.ok) {
      showError('Todoの取得に失敗しました');
      return;
    }
    const todos = await res.json();
    renderTodos(todos);
  } catch (err) {
    showError('サーバーに接続できません');
  }
}

function renderTodos(todos) {
  todoList.innerHTML = '';
  todos.forEach((todo) => {
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id, checkbox.checked));

    const span = document.createElement('span');
    span.textContent = todo.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = todoInput.value.trim();
  if (!title) {
    showError('タイトルを入力してください');
    return;
  }
  try {
    const res = await fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      const data = await res.json();
      showError(data.error || 'Todoの追加に失敗しました');
      return;
    }
    todoInput.value = '';
    fetchTodos();
  } catch (err) {
    showError('サーバーに接続できません');
  }
});

async function toggleTodo(id, completed) {
  try {
    const res = await fetch(`/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) {
      const data = await res.json();
      showError(data.error || '更新に失敗しました');
    }
    fetchTodos();
  } catch (err) {
    showError('サーバーに接続できません');
  }
}

async function deleteTodo(id) {
  try {
    const res = await fetch(`/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      showError(data.error || '削除に失敗しました');
      return;
    }
    fetchTodos();
  } catch (err) {
    showError('サーバーに接続できません');
  }
}

fetchTodos();
