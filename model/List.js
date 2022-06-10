class List {
  constructor(db) {
    this.db = db.connect();
  }

  getLists() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM lists', (err, rows) => {
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
      this.db.get('SELECT * FROM lists WHERE id = ?', id, (err, row) => {
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
      this.db.run('INSERT INTO lists (title) VALUES (?)', list.title, (err) => {
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
      this.db.run('UPDATE lists SET title = ? WHERE id = ?', list.name, list.id, (err) => {
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
      this.db.run('DELETE FROM lists WHERE id = ?', id, (err) => {
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