const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    addPatient: (data) => ipcRenderer.invoke('add-patient', data),
});