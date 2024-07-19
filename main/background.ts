import path from 'path'
import { app, ipcMain, dialog, BrowserWindow, shell } from 'electron'
import serve from 'electron-serve'

const isProd = process.env.NODE_ENV === 'production'

let mainWindow: BrowserWindow

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('deep-link', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('deep-link')
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', async (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }

    const url = new URL(commandLine.pop().slice(0))
    
    if (url.hostname === 'open') {

      const params = url.searchParams
      const address = params.get('address');

      mainWindow.webContents.send('send-address', address);
    }

  })

  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(async () => {
    await createWindow()
    //@ts-ignore
    /* mainWindow.webContents.on('open-external', () => {
      console.log('open-external')
      dialog.showMessageBox(mainWindow, { message: 'test' })
      shell.openExternal("http://localhost:3000/wallet-login");
    }) */
  })

}

ipcMain.on('open-external', () => {
  // dialog.showMessageBox(mainWindow, { message: 'google' })
  shell.openExternal("http://localhost:3000/wallet-connect");
})
async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })


  if (isProd) {
    await mainWindow.loadURL('app://./home')
    mainWindow.webContents.openDevTools()
    //@ts-ignore
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }

}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}
