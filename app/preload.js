const { contextBridge, ipcRenderer } = require('electron');

const api = {
    versions: {
        node: () => process.versions.node,
        chrome: () => process.versions.chrome,
        electron: () => process.versions.electron,
    },
    openFolder: () => ipcRenderer.invoke('openFolder'),
    readImageInfos: (folder) => ipcRenderer.invoke('readImageInfos', folder),
    readImage: (folder, filename) => ipcRenderer.invoke('readImage', folder, filename),
};

contextBridge.exposeInMainWorld('diashow-api', api);
