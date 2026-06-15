const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    addPatient: (data) => {
        return ipcRenderer.invoke('add-patient', data);
    },

    getFrequentVisitors: () => {
        return ipcRenderer.invoke('get-frequent-visitors');
    },
    searchPatients: (query) => ipcRenderer.invoke('search-patients', query),
    getPatientDetails: (patientId) => ipcRenderer.invoke('get-patient-details', patientId),
    createAppointment: (data) => ipcRenderer.invoke('create-appointment', data),
     deletePatient: (patientId) => ipcRenderer.invoke('delete-patient', patientId),
});