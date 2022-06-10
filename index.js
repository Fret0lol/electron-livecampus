const { app, BrowserWindow, Menu, ipcMain, dialog, Notification, getCurrentWindow } = require('electron')

const path = require('path')
let newKanban = null
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})