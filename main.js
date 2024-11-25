const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile('index.html');
});

ipcMain.on('scheduleShutdown', (event, minutes) => {
  const delaySeconds = minutes * 60;
  const os = process.platform;
  console.log('Scheduling shutdown');
  let command = '';
  if (os === 'win32') {
    command = `shutdown /s /t ${delaySeconds}`;
  } else if (os === 'linux' || os === 'darwin') {
    command = `shutdown -h +${minutes}`;
  }

  exec(command, (err) => {
    if (err) {
      event.reply('error', `Error: ${err.message}`);
    } else {
      event.reply('success', `Shutdown scheduled in ${minutes} minutes.`);
    }
  });
});

ipcMain.on('cancelShutdown', (event) => {
  const os = process.platform;
  let command = '';
  if (os === 'win32') {
    command = 'shutdown /a';
  } else {
    event.reply('error', 'Cancel not supported on this OS.');
    return;
  }

  exec(command, (err) => {
    if (err) {
      event.reply('error', `Error: ${err.message}`);
    } else {
      event.reply('success', 'Shutdown canceled.');
    }
  });
});
