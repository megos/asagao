'use strict';

var app           = require('app');
var browserWindow = require('browser-window');
var shell         = require('shell');

require('crash-reporter').start();

var mainWindow = null;

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
});