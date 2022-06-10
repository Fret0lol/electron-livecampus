class Task {
  constructor(db) {
    this.db = db.connect();
  }

  getTasks() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  getTask(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM tasks WHERE id = ?', id, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  createTask(task) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO tasks (title, rank, list_id) VALUES (?, ?, ?)', task.title, task.rank, task.list_id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.getTask(this.db.lastID));
        }
      });
    });
  }

  updateTask(task) {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE tasks SET title = ?, rank = ?, list_id = ? WHERE id = ?', task.title, task.rank, task.list_id, task.id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.getTask(task.id));
        }
      });
    });
  }

  deleteTask(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM tasks WHERE id = ?', id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

}