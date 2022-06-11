class Task {
  constructor(db) {
    this.db = db.connect();
  }

  getTasks() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM Task ORDER BY rank', (err, rows) => {
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
      this.db.get('SELECT * FROM Task WHERE id = ?', id, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  getTasksByList(id) {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM Task WHERE list_id = ?', id, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  createTask(task) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO Task (title, rank, list_id) VALUES (?, ?, ?)', task.title, task.rank, task.list_id, (err) => {
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
      this.db.run('UPDATE Task SET title = ?, rank = ?, list_id = ? WHERE id = ?', task.title, task.rank, task.list_id, task.id, (err) => {
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
      this.db.run('DELETE FROM Task WHERE id = ?', id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  upTask(id) {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE Task SET rank = rank-1 WHERE id = ?', id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  downTask(id) {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE Task SET rank = rank+1 WHERE id = ?', id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  //deplace une tache horizontalement en lui affectant le rang adequat
  leftTask(id) {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE Task SET list_id = list_id-1, rank = (SELECT COUNT(*) FROM Task WHERE list_id = (SELECT list_id FROM Task WHERE id = ?) - 1) + 1 WHERE id = ?', id, id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  //deplace une tache horizontalement en lui affectant le rang adequat
  rightTask(id) {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE Task SET list_id = list_id+1, rank = (SELECT COUNT(*) FROM Task WHERE list_id = (SELECT list_id FROM Task WHERE id = ?) + 1) + 1 WHERE id = ?', id, id,(err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  //met à jour les rangs de la colonne d'origine du déplacement
  downLeftTasks(id){
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE Task SET rank = rank - 1 WHERE list_id = (SELECT list_id FROM Task WHERE id = ?) AND rank > (SELECT rank FROM Task WHERE id = ?)', id, id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  //met à jour les rangs de la colonne d'origine du déplacement
  downRightTasks(id){
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE Task SET rank = rank - 1 WHERE list_id = (SELECT list_id FROM Task WHERE id = ?) AND rank > (SELECT rank FROM Task WHERE id = ?)', id, id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = Task;