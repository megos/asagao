'use strict'

import { app, shell, BrowserWindow } from 'electron'
import OAuthTwitter from 'electron-oauth-twitter'
import storage from 'electron-json-storage-sync'
import { credentials, keys } from '../constants'
import ContextMenu from 'electron-context-menu'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  const oauthInfo = storage.get(keys.OAUTH_TOKEN)
  openWindow()
  if (oauthInfo.status && oauthInfo.data.oauth_access_token && oauthInfo.data.oauth_access_token_secret) {
    mainWindow.loadURL(winURL)
  } else {
    const twitterAuthWindow = new OAuthTwitter({
      key: credentials.CONSUMER_KEY,
      secret: credentials.CONSUMER_SECRET
    })

    twitterAuthWindow.startRequest()
      .then((res) => {
        const result = storage.set(keys.OAUTH_TOKEN, res)
        if (result.status) {
          mainWindow.loadURL(winURL)
        } else {
          console.error('Token save failed!')
        }
      })
      .catch((err) => {
        console.error(err, err.stack)
      })
  }
}

function openWindow () {
  mainWindow = new BrowserWindow({
    height: 700,
    width: 400,
    titleBarStyle: 'hidden',
    useContentSize: true
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.webContents.on('new-window', (event, url) => {
    if (!(url.match(/.*(jpg|png|mp4|size=l)$/) ||
        url.match(/.*pixiv\.net.*[0-9]+$/))) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // TODO: If windows or linux, after login close...
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ContextMenu()

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
