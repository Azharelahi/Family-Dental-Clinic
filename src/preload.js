const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    addPatient: (data) => {
        console.log("Data received in preload.js:", data);
        return ipcRenderer.invoke('add-patient', data);
    },
});