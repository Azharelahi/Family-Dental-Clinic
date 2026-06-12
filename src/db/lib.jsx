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