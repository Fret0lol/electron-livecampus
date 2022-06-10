class List {
  constructor(db) {
    this.db = db.connect();
  }

  getLists() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM List', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  getList(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM List WHERE id = ?', id, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  createList(list) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO List (title) VALUES (?)', list.title, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.getList(this.db.lastID));
        }
      });
    });
  }

  updateList(list) {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE List SET title = ? WHERE id = ?', list.name, list.id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.getList(list.id));
        }
      });
    });
  }

  deleteList(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM List WHERE id = ?', id, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = List;