const { app, BrowserWindow, Menu, ipcMain, dialog, Notification, getCurrentWindow } = require('electron')

const path = require('path')
const database = require('./model/Database')
const Task = require('./model/Task')
const List = require('./model/List')
const db = new database('database.db')
let newKanban = null
const tasks = new Task(db)
const lists = new List(db)
const menu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New item',
        click() {
          newKanban = createNewWindow()
        }
      },
      {
        role: 'reload',
        accelerator:'F5'
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
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
})

const createNewWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'script/preload-kanban.js')
    }
  })
  win.loadFile('template/formKanban.html')
  return win
}



ipcMain.on('quit', (e, data) => {
  newKanban.close()
})

ipcMain.on('task:add', (e, data) => {
  const notif = new Notification({
    title: 'Task added',
    body: 'Congratulations, you added a new task',
    //icon: 'assets/check_one_icon.png'
  })

  tasks.getTasksByList(data.list_id).then(item => {
    console.log(data.title, ' -> ', item.length + 1, ' -> ', data.list_id)

    data.rank = item.length + 1
    tasks.createTask(data)
      .then(
        () => {
          newKanban.close()
        },
        error => console.log(error)
      )

    notif.show()
  })
  tasks.getTasks().then(data => {
    console.log(data)
  })
})

ipcMain.on('list:deleteTask', (e, data) => {
  console.log(data)
  dialog.showMessageBox(getCurrentWindow, {
    type: 'question',
    buttons: ['Oui', 'Non'],
    title: 'Supprimer une tâche',
    message: 'Voulez-vous vraiment supprimer cette tâche ?'
  }).then((response) => {
    if (response.response === 0) {
      tasks.deleteTask(data.id)
        .then(
          () => {
            console.log('task deleted')
            e.reply('list:deleteTask', data.id)
          }
        )
    }
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

ipcMain.on('list:modify', (e, data) => {
  console.log(data)
})

if (process.env.NODE_ENV !== 'production') {
  menu.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform ==='darwin' ? 'Command+I' : 'Ctrl+I',

        click(item, focusedWindow) {
          focusedWindow.webContents.toggleDevTools()
        }
      }, 
      {
        role: 'reload',
        accelerator:'F5'
      }
    ]
  })
}
