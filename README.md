# Todo API

Node.js + Express.js で構築したシンプルな Todo リスト API です。データはメモリ上で管理します。

## セットアップ

```bash
npm install
```

## 起動方法

```bash
npm start
```

デフォルトではポート `3000` で起動します。環境変数 `PORT` で変更可能です。

## テスト

```bash
npm test
```

## エンドポイント一覧

### Todo 一覧を取得

```
GET /todos
```

**レスポンス例:**

```json
[
  { "id": 1, "title": "買い物", "completed": false },
  { "id": 2, "title": "掃除", "completed": true }
]
```

### Todo を新規作成

```
POST /todos
```

**リクエストボディ:**

```json
{ "title": "タスク名" }
```

**レスポンス例 (201):**

```json
{ "id": 1, "title": "タスク名", "completed": false }
```

### Todo の完了状態を更新

```
PATCH /todos/:id
```

**リクエストボディ:**

```json
{ "completed": true }
```

**レスポンス例 (200):**

```json
{ "id": 1, "title": "タスク名", "completed": true }
```

### Todo を削除

```
DELETE /todos/:id
```

**レスポンス:** `204 No Content`
