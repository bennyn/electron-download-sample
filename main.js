const electron = require('electron');
const path = require('path');
const url = require('url');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  
  mainWindow.on('closed', () => {
    mainWindow = null
  });
  
  mainWindow.webContents.session.once('will-download', function onDownload(e, item) {
    let defaultFilename = item.getFilename();
    
    const options = {
      defaultPath: path.basename('sample.ext')
    };
    
    let filename = electron.dialog.showSaveDialog(mainWindow, options);
    
    if (!filename) {
      item.cancel();
    } else {
      const savePathObject = path.parse(filename);
      savePathObject.base = null;
      savePathObject.ext = savePathObject.ext || path.extname(defaultFilename);
      item.setSavePath(path.format(savePathObject));
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
