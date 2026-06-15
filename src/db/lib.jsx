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
export function handleCreateAppointment(data) {
    const { name, phone, appointment_date, appointment_time, purpose } = data;

    try {
        const patientId = db.getPatientIdByNameAndPhone(name, phone);
        if (!patientId) {
            return { success: false, error: "Patient not found" };
        }

        const medicalRecordId = db.getLatestMedicalRecordId(patientId);
        if (!medicalRecordId) {
            return { success: false, error: "No medical record found for patient" };
        }

        const appointmentId = db.addAppointment({
            medical_record_id: medicalRecordId,
            patient_id: patientId,
            appointment_date,
            appointment_time,
            purpose,
        });

        return { success: true, appointmentId, message: "Appointment scheduled successfully" };
    } catch (error) {
        console.error("Create appointment error:", error);
        return { success: false, error: error.message };
    }
}
export function handleDeletePatient(patientId) {
    try {
        const changes = db.deletePatientCascade(patientId);
        if (changes === 0) {
            return { success: false, error: "Patient not found" };
        }
        return { success: true, message: "Patient deleted successfully" };
    } catch (error) {
        console.error("Delete patient error:", error);
        return { success: false, error: error.message };
    }
}