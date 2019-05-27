const electron = require('electron');
const path = require('path');
const url = require('url');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.webContents.openDevTools({mode: 'detach'});

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.session.once('will-download', function onDownload(event, item) {
    event.preventDefault();
    let originalName = item.getFilename();

    const options = {
      defaultPath: path.basename('sample.ext')
    };

    let fileName = electron.dialog.showSaveDialog(mainWindow, options);

    if (!fileName) {
      item.cancel();
    } else {
      const targetPath = path.parse(fileName);
      targetPath.base = null;
      targetPath.ext = targetPath.ext || path.extname(originalName);
      item.setSavePath(path.format(targetPath));
    }
  });

  mainWindow.webContents.on('dom-ready', () => {
    const url = 'https://bitcoin.org/bitcoin.pdf';
    mainWindow.show();
    mainWindow.webContents.downloadURL(url);
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
