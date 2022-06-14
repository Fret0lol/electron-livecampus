const { app, BrowserWindow, Menu, ipcMain, dialog, Notification, getCurrentWindow } = require('electron')

const path = require('path')
const database = require('./model/Database')
const Task = require('./model/Task')
const List = require('./model/List')
const db = new database('database.db')
let newKanban = null
let updateKanban = null
const tasks = new Task(db)
const lists = new List(db)
let w

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
        accelerator: 'F5'
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
  return win
}


app.whenReady().then(() => {
  w = createWindow()
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


const createUpdateWindow = () => {
  const winUpdate = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  winUpdate.loadFile('template/formUpdateKanban.html')
  return winUpdate
}



ipcMain.on('quit', (e, data) => {
  newKanban.close()
})

ipcMain.on('task:up', (e, data) => {
  tasks.upTask(data)
})

ipcMain.on('task:down', (e, data) => {
  tasks.downTask(data)
})

ipcMain.on('task:right', (e, data) => {
  tasks.downRightTasks(data)
  tasks.rightTask(data)
})

ipcMain.on('task:left', (e, data) => {
  tasks.downLeftTasks(data)
  tasks.leftTask(data)
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
          w.reload()
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
            const notifDelete = new Notification({
              title: 'Task deleted',
              body: 'The task has been deleted'
            })
            notifDelete.show()
            console.log('task deleted')
            e.reply('list:deleteTask', data.id)
            w.reload()
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

let updateTaskId = null
ipcMain.on('list:modify', (e, data) => {
  updateTaskId = data
  updateKanban = createUpdateWindow()
})

ipcMain.on('task:update', (e, data) => {
  tasks.getTask(updateTaskId).then(item => {
    e.sender.send('task:update', item)
  })
})

ipcMain.on('task:update:u', (e, data) => {
  console.log(data)
  const notifModify = new Notification({
    title: 'Task modified',
    body: 'The task has been modified'
  })
  notifModify.show()
  tasks.updateTask(data).then((res) => {
    console.log(res)
    updateKanban.close()
    w.reload()
  })
})

if (process.env.NODE_ENV !== 'production') {
  menu.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',

        click(item, focusedWindow) {
          focusedWindow.webContents.toggleDevTools()
        }
      },
      {
        role: 'reload',
        accelerator: 'F5'
      }
    ]
  })
}
