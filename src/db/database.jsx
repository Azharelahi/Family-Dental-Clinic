import { app } from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';

class AppDatabase {
    constructor() {
        this.dbPath = path.join(
            app.getPath('userData'),
            'familyDental.db'
        );

        this.db = new Database(this.dbPath);
        this.db.pragma('journal_mode = WAL');

        this.setUpDatabase();
    }

    setUpDatabase() {
        // 👤 Patients table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS patients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                full_name TEXT NOT NULL,
                date_of_birth DATE NOT NULL,
                gender TEXT NOT NULL,
                phone TEXT NOT NULL,

                address TEXT,
                status TEXT DEFAULT 'Active',

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 🩺 Medical Records table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS medical_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                patient_id INTEGER NOT NULL,

                complaint TEXT,
                diagnosis TEXT,
                treatment TEXT,
                notes TEXT,
                complaint_status TEXT DEFAULT 'open',

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (patient_id) REFERENCES patients(id)
            )
        `);
        this.db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        medical_record_id INTEGER NOT NULL,
        patient_id INTEGER NOT NULL,

        appointment_date DATE NOT NULL,
        appointment_time TEXT,
        purpose TEXT,
        status TEXT DEFAULT 'scheduled',

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (medical_record_id) REFERENCES medical_records(id),
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
`);

        console.log('Database initialized at:', this.dbPath);
    }
    addPatientWithRecord(patientPayload, medicalPayload) {
    const insertPatient = this.db.prepare(`
        INSERT INTO patients (full_name, date_of_birth, gender, phone, address, status)
        VALUES (@full_name, @date_of_birth, @gender, @phone, @address, @status)
    `);

    const insertRecord = this.db.prepare(`
        INSERT INTO medical_records (patient_id, complaint, diagnosis, treatment, notes)
        VALUES (@patient_id, @complaint, @diagnosis, @treatment, @notes)
    `);

    const insertTransaction = this.db.transaction((patientPayload, medicalPayload) => {
        const result = insertPatient.run(patientPayload);
        const patientId = result.lastInsertRowid;

        insertRecord.run({ ...medicalPayload, patient_id: patientId });

        return patientId;
    });

    return insertTransaction(patientPayload, medicalPayload);
}
getFrequentVisitors() {
    const query = this.db.prepare(`
        SELECT
            p.id,
            p.full_name,
            CAST((julianday('now') - julianday(p.date_of_birth)) / 365.25 AS INTEGER) AS age,
            p.gender,
            p.phone,
            m.complaint,
            m.created_at AS last_visit,
            (SELECT COUNT(*) FROM medical_records WHERE patient_id = p.id) AS visit_count
        FROM patients p
        LEFT JOIN medical_records m ON m.id = (
            SELECT id FROM medical_records
            WHERE patient_id = p.id
            ORDER BY created_at DESC
            LIMIT 1
        )
        ORDER BY visit_count DESC, m.created_at DESC
        LIMIT 10
    `);

    return query.all();
}
searchPatients(query) {
    const stmt = this.db.prepare(`
        SELECT
            p.id,
            p.full_name,
            CAST((julianday('now') - julianday(p.date_of_birth)) / 365.25 AS INTEGER) AS age,
            p.gender,
            p.phone,
            m.complaint,
            m.created_at AS last_visit
        FROM patients p
        LEFT JOIN medical_records m ON m.id = (
            SELECT id FROM medical_records
            WHERE patient_id = p.id
            ORDER BY created_at DESC
            LIMIT 1
        )
        WHERE p.full_name LIKE ?
        ORDER BY p.full_name ASC
        LIMIT 20
    `);

    return stmt.all(`${query}%`);
}
getPatientDetails(patientId) {
    const patient = this.db.prepare(`
        SELECT id, full_name, date_of_birth, gender, phone, address, status
        FROM patients
        WHERE id = ?
    `).get(patientId);

    if (!patient) return null;

    const records = this.db.prepare(`
        SELECT id, complaint, diagnosis, treatment, notes, complaint_status, created_at
        FROM medical_records
        WHERE patient_id = ?
        ORDER BY created_at DESC
    `).all(patientId);

    const age = patient.date_of_birth
        ? Math.floor((Date.now() - new Date(patient.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
        : null;

    const [latest, ...previous] = records;

    return {
        name: patient.full_name,
        patientId: patient.id,
        age,
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address,
        dateOfBirth: patient.date_of_birth,
        issue: latest?.treatment || "No recent appointment",
        complaint: latest?.complaint || "—",
        diagnosis: latest?.diagnosis || "—",
        notes: latest?.notes || "",
        previousVisits: previous.map(v => ({
            date: v.created_at,
            reason: v.complaint,
            doctor: "—",
        })),
    };
}
getPatientIdByNameAndPhone(name, phone) {
    const row = this.db.prepare(`
        SELECT id FROM patients
        WHERE full_name = ? AND phone = ?
    `).get(name, phone);

    return row ? row.id : null;
}

getLatestMedicalRecordId(patientId) {
    const row = this.db.prepare(`
        SELECT id FROM medical_records
        WHERE patient_id = ?
        ORDER BY created_at DESC
        LIMIT 1
    `).get(patientId);

    return row ? row.id : null;
}

addAppointment(payload) {
    const insert = this.db.prepare(`
        INSERT INTO appointments (medical_record_id, patient_id, appointment_date, appointment_time, doctor,purpose)
        VALUES (@medical_record_id, @patient_id, @appointment_date, @appointment_time, @doctor,@purpose)
    `);

    const result = insert.run(payload);
    return result.lastInsertRowid;
}
deletePatientCascade(patientId) {
    const deleteAppointments = this.db.prepare(`DELETE FROM appointments WHERE patient_id = ?`);
    const deleteMedicalRecords = this.db.prepare(`DELETE FROM medical_records WHERE patient_id = ?`);
    const deletePatient = this.db.prepare(`DELETE FROM patients WHERE id = ?`);

    const transaction = this.db.transaction((patientId) => {
        deleteAppointments.run(patientId);
        deleteMedicalRecords.run(patientId);
        const result = deletePatient.run(patientId);
        return result.changes;
    });

    return transaction(patientId);
}
getAppointmentsByStatus(status) {
    return this.db.prepare(`
        SELECT
            a.id,
            p.full_name AS patient_name,
            a.purpose,
            a.appointment_date,
            a.appointment_time,
            a.doctor,
            a.status
        FROM appointments a
        INNER JOIN patients p
            ON p.id = a.patient_id
        WHERE a.status = ?
        ORDER BY a.appointment_date ASC,
                 a.appointment_time ASC
    `).all(status);
}
}

export default AppDatabase;