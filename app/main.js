const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('node:path');
const fs = require('node:fs');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreenable: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // devTools: true,
        },
        center: true,
        title: 'Diashow',
        autoHideMenuBar: true,
    });

    if (process.argv.includes('develop')) {
        mainWindow.loadURL('http://localhost:4200');
    } else {
        mainWindow.loadFile('dist/diashow/browser/index.html');
    }
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle('openFolder', (_event) => {
    const ret = dialog.showOpenDialogSync(mainWindow, {
        properties: ['openDirectory'],
    });
    return ret != undefined && ret.length === 1 ? ret[0] : undefined;
});

ipcMain.handle('readImageInfos', (_event, folder) => {

    function scanFotos(folder, result) {
        const entries = fs.readdirSync(folder, {
            withFileTypes: true,
        });
        entries.forEach(e => {
            if (e.isDirectory()) {
                scanFotos(path.join(folder, e.name), result);
            } else if (e.isFile()) {
                const lastModified = fs.lstatSync(path.join(folder, e.name)).mtimeMs;
                result.push({
                    folder,
                    filename: e.name,
                    lastModified,
                });
            }
        });
    }

    const ret = [];
    scanFotos(folder, ret);
    return ret;
});

ipcMain.handle('readImage', (_event, folder, filename) => {
    const buffer = fs.readFileSync(path.join(folder, filename));
    return new Uint8Array(buffer);
});