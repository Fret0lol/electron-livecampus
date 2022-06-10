const { app, BrowserWindow } = require('electron')

// Database
const Database = require('./model/Database')
const db = new Database('database.db')
  // List
const List = require('./model/List')
const lists = new List(db)
  // Task
const Task = require('./model/Task')
const tasks = new Task(db)

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  lists.getLists().then(data => {
    console.log(data)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})