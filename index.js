const { app, BrowserWindow, Menu, ipcMain, dialog, Notification, getCurrentWindow } = require('electron')

const path = require('path')
const database = require('./model/Database')
const Task = require('./model/Task')
const db = new database('database.db')
let newKanban = null
const tasks = new Task(db)
const menu = [
  {
    label : 'File',
    submenu : [
      {
        label: 'New item',
        click() {
         newKanban = createNewWindow()
        }
      },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click() {
          app.quit()
        }
      }
    ]
  }
]

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}



app.whenReady().then(() => {
  createWindow()
  const mainMenu  = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
})

const createNewWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      preload:path.join(app.getAppPath(), 'script/preload-kanban.js')
    }
  })
  win.loadFile('template/formKanban.html')
  return win
}


ipcMain.on('quit', (e, data) => {
  newKanban.close()
})

ipcMain.on('task:add', (e , data) => {
  const notif = new Notification({
    title: 'Task ajouté',
    body: 'Bravo vous avez ajouté un task',
    //icon: 'assets/check_one_icon.png'
  })
  tasks.addTask(data)
  .then(
    () => {
      w.webContents.send('item:add', data)
      w.reload()
    },
    error => console.log(error)
  )

  notif.show()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})