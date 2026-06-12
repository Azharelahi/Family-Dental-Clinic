import AppDatabase from "./database";
let db = new AppDatabase();

export function addPatient(data){
    const { patientPayload, medicalPayload } = data;

    try {
        const patientId = db.addPatientWithRecord(patientPayload, medicalPayload);
        return { success: true, patientId };
    } catch (error) {
        console.error("DB insert error:", error);
        return { success: false, error: error.message };
    }
}

export function getFrequentVisitors() {
    console.log("Fetching frequent visitors from database...");
    try {
        const visitors = db.getFrequentVisitors();
        return visitors;
    } catch (error) {
        console.error("DB query error:", error);
        return { success: false, error: error.message };
    }
}

export function handleSearchPatients(query) {
    try {
        return db.searchPatients(query);
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}
export function handleGetPatientDetails(patientId) {
    try {
        return db.getPatientDetails(patientId);
    } catch (error) {
        console.error("Get patient details error:", error);
        return null;
    }
}