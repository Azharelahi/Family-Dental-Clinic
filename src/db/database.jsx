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
}

export default AppDatabase;