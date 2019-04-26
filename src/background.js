

import {
  app, shell, protocol, BrowserWindow,
} from 'electron'
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib'
import OAuthTwitter from 'electron-oauth-twitter'
import storage from 'electron-json-storage-sync'
import ContextMenu from 'electron-context-menu'
import { credentials, keys } from './constants'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Standard scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', secure: true }])
function createWindow() {
  // Create the browser window.
  // win = new BrowserWindow({ width: 800, height: 600 })
  let winURL

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    winURL = process.env.WEBPACK_DEV_SERVER_URL
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    winURL = 'app://./index.html'
  }

  const oauthInfo = storage.get(keys.OAUTH_TOKEN)
  openWindow()
  if (oauthInfo.status
    && oauthInfo.data.oauth_access_token
    && oauthInfo.data.oauth_access_token_secret) {
    win.loadURL(winURL)
  } else {
    const twitterAuthWindow = new OAuthTwitter({
      key: credentials.CONSUMER_KEY,
      secret: credentials.CONSUMER_SECRET,
    })

    twitterAuthWindow.startRequest()
      .then((res) => {
        const result = storage.set(keys.OAUTH_TOKEN, res)
        if (result.status) {
          win.loadURL(winURL)
        } else {
          console.error('Token save failed!')
        }
      })
      .catch((err) => {
        console.error(err, err.stack)
      })
  }
}

function openWindow() {
  win = new BrowserWindow({
    height: 700,
    width: 400,
    titleBarStyle: 'hidden',
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  if (!process.env.IS_TEST) win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })

  win.webContents.on('new-window', (event, url) => {
    if (!(url.match(/.*(jpg|png|mp4|size=l)$/)
        || url.match(/.*pixiv\.net.*[0-9]+$/))) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ContextMenu()
