const { app, BrowserWindow, ipcMain } = require('electron')

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
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,

    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  lists.getLists().then(data => {
    console.log(data)
  })
  tasks.getTasks().then(data => {
    console.log(data)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// List
ipcMain.on('list:getAll', (event) => {
  lists.getLists().then(data => {
    event.sender.send('list:getAll', data)
  })
})

ipcMain.on('list:getTasks', (event) => {
  tasks.getTasks().then(data => {
    event.sender.send('list:getTasks', data)
  })
})