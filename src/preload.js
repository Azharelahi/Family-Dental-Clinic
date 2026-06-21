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
 getScheduledAppointments: () => ipcRenderer.invoke('get-scheduled-appointments'),
getCompletedAppointments: () => ipcRenderer.invoke('get-completed-appointments'),
getCancelledAppointments: () => ipcRenderer.invoke('get-cancelled-appointments'),
deleteAppointment:   (appointmentId) => ipcRenderer.invoke('delete-appointment', appointmentId),
completeAppointment: (appointmentId) => ipcRenderer.invoke('complete-appointment', appointmentId),
updateAppointment:   (appointmentId, fields) => ipcRenderer.invoke('update-appointment', appointmentId, fields),
getDashboardStats: () => ipcRenderer.invoke('get-dashboard-stats'),
getAnalyticsAppointments: (filters) => ipcRenderer.invoke('get-analytics-appointments', filters),
});