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
    
}

export default AppDatabase;