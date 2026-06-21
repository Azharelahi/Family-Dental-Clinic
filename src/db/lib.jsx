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
    const { name, phone, appointment_date, appointment_time,doctor, purpose } = data;
console.log("Creating appointment with data:", data);
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
            doctor,
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
export function handleGetScheduledAppointments() {
    try {
        return db.getAppointmentsByStatus('scheduled');
    } catch (error) {
        console.error("Get scheduled appointments error:", error);
        return [];
    }
}
export function handleGetAnalyticsAppointments(filters) {
    try {
        return db.getAnalyticsAppointments(filters);
    } catch (error) {
        console.error("Analytics fetch error:", error);
        return [];
    }
}
export function handleGetCompletedAppointments() {
    try {
        return db.getAppointmentsByStatus('completed');
    } catch (error) {
        console.error("Get completed appointments error:", error);
        return [];
    }
}

export function handleGetCancelledAppointments() {
    try {
        return db.getAppointmentsByStatus('cancelled');
    } catch (error) {
        console.error("Get cancelled appointments error:", error);
        return [];
    }
}
export function handleDeleteAppointment(appointmentId) {
    try {
        const changes = db.deleteAppointment(appointmentId);
        if (changes === 0) return { success: false, error: "Appointment not found" };
        return { success: true, message: "Appointment deleted" };
    } catch (error) {
        console.error("Delete appointment error:", error);
        return { success: false, error: error.message };
    }
}

export function handleCompleteAppointment(appointmentId) {
    try {
        const changes = db.updateAppointmentStatus(appointmentId, 'completed');
        if (changes === 0) return { success: false, error: "Appointment not found" };
        return { success: true, message: "Appointment marked as completed" };
    } catch (error) {
        console.error("Complete appointment error:", error);
        return { success: false, error: error.message };
    }
}

export function handleUpdateAppointment(appointmentId, fields) {
    try {
        const changes = db.updateAppointment(appointmentId, fields);
        if (changes === 0) return { success: false, error: "Appointment not found" };
        return { success: true, message: "Appointment updated" };
    } catch (error) {
        console.error("Update appointment error:", error);
        return { success: false, error: error.message };
    }
}
export function handleGetDashboardStats() {
    try {
        return {
            totalPatients: db.getTotalPatients(),
            todaysAppointments: db.getTodaysAppointments(),
        };
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return { totalPatients: 0, todaysAppointments: 0 };
    }
}