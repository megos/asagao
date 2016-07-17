'use strict';

var electron      = require('electron');
var app           = electron.app;
var browserWindow = electron.BrowserWindow;
var shell         = electron.shell;
var Menu          = electron.Menu;
var ipcMain       = electron.ipcMain;

// electron.crashReporter.start();

var mainWindow = null;
var imageWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new browserWindow({width: 500, height: 600, webPreferences: {webSecurity: false}});
  mainWindow.loadURL('file://' + __dirname + '/view/login.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.webContents.on('new-window', function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Menu.setApplicationMenu(menu);
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

// var menu = Menu.buildFromTemplate(template);