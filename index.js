'use strict';

const electron      = require('electron');
const app           = electron.app;
const browserWindow = electron.BrowserWindow;
const shell         = electron.shell;
const Menu          = electron.Menu;
const ipcMain       = electron.ipcMain;
const storage       = require('electron-json-storage');
const settings      = require('./app/settings');
const OauthTwitter  = require('electron-oauth-twitter');

// electron.crashReporter.start();

var mainWindow = null;
var imageWindow = null;

const twitter = new OauthTwitter({
      key: settings.TWITTER_CONSUMER_KEY,
      secret: settings.TWITTER_CONSUMER_SECRET,
});

storage.get('auth', function(error, data) {
  if (error) {
    throw error
  }

  if (Object.keys(data).length === 0) {

    twitter.startRequest().then((result) => {
      const auth = {
        accessTokenKey: result.oauth_access_token,
        accessTokenSecret: result.oauth_access_token_secret
      };
      storage.set('auth', auth, function(error) {
        if (error) {
          throw error;
        }
        openMainWindow();
      });
    }).catch((error) => {
      console.error(error, error.stack);
    });

  } else {
    openMainWindow();
  }
});

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

ipcMain.on('open-window', function(event, url, height, width) {
  // TODO: マジックナンバーをどうにかする
  var titleBarHeight = 22;
  imageWindow = new browserWindow({
    height: height + titleBarHeight,
    width: width
  });
  imageWindow.loadURL(url);
  imageWindow.on('closed', function() {
    imageWindow = null;
  });
});

var template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  }
];


function openMainWindow() {
  mainWindow = new browserWindow({width: 400, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/view/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.webContents.on('new-window', function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });
}

// var menu = Menu.buildFromTemplate(template);