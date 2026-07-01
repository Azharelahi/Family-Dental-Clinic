# 🦷 Family Dental Clinic — Desktop Management System

> A fully offline, production-grade desktop application built for **Family Dental Clinic, Cantt Abbottabad**, owned by **Abdullah Niaz**. Designed and developed by **Azhar Elahi** and **Safiullah** to replace manual registers with a fast, reliable, and data-safe clinic management system.

---

---

## ✨ Overview

Family Dental Clinic Desktop is a tailor-made patient and appointment management system built on **Electron + React + SQLite**. It runs entirely on the clinic's local machine with zero internet dependency, zero subscription cost, and zero risk of patient data leaving the premises.

The system was designed around how a real dental clinic front desk actually operates, not around what a generic template provides.

---

## 🏗️ Architecture Decisions

### Why Electron + SQLite, not a web app?

A single-location clinic with one front desk does not need cloud infrastructure, a hosting bill, or an internet connection to look up a patient record. The right tool here is a desktop app with a local database. `better-sqlite3` was chosen specifically for its synchronous API, which pairs naturally with Electron's main process without introducing async complexity at the data layer.

### Why a layered IPC architecture?

All database access flows through a strict chain:

```
Renderer (React) → contextBridge (preload.js) → ipcMain (main.js) → lib.jsx (business logic) → AppDatabase (SQL)
```

No renderer process touches the database directly. This mirrors a backend service boundary, keeps SQL out of UI code, and makes the system testable and maintainable.

### Why a relational schema over a flat table?

A dental patient does not have "one record." They have multiple visits, each with a distinct diagnosis and treatment, and each visit can have multiple follow-up appointments. The schema reflects this:

```
patients → medical_records → appointments
```

This structure allows queries like "who missed their follow-up?" and "what is this patient's full history?" without any data duplication or ambiguity.

---

## 🗄️ Database Schema

```sql
-- Core patient registry
CREATE TABLE patients (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_code    TEXT UNIQUE,
    full_name       TEXT NOT NULL,
    date_of_birth   DATE NOT NULL,
    gender          TEXT NOT NULL,
    phone           TEXT NOT NULL,
    address         TEXT,
    status          TEXT DEFAULT 'Active',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- One row per diagnosed issue / visit case
CREATE TABLE medical_records (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id       INTEGER NOT NULL,
    complaint        TEXT,
    diagnosis        TEXT,
    treatment        TEXT,
    notes            TEXT,
    complaint_status TEXT DEFAULT 'open',
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- One row per scheduled visit, linked to a specific case
CREATE TABLE appointments (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    medical_record_id INTEGER NOT NULL,
    patient_id        INTEGER NOT NULL,
    appointment_date  DATE NOT NULL,
    appointment_time  TEXT,
    doctor            TEXT,
    purpose           TEXT,
    status            TEXT DEFAULT 'scheduled',
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id),
    FOREIGN KEY (patient_id)        REFERENCES patients(id)
);
```

---

## 🚀 Features

### 👤 Patient Management
- Add new patients with personal and medical information in a single form
- Auto-generated unique patient ID (`FDC_001`, `FDC_002`, ...)
- Phone number validation enforced at input level (Pakistani `03XXXXXXXXX` format)
- Active search: results update on every keystroke via live DB query
- Full patient detail modal with personal info and complete visit history
- Cascading delete: removing a patient removes all their records and appointments atomically in a single transaction

### 🩺 Medical Records
- Each patient visit creates a separate medical record (complaint, diagnosis, treatment, notes)
- Problem-to-treatment auto-suggestion: selecting a complaint pre-fills the most common matching treatment
- Complaint status tracking (`open` / `closed`)

### 📅 Appointments
- Schedule follow-up appointments linked to a specific medical record
- Doctor assignment per appointment
- Status tracking: `scheduled`, `completed`, `cancelled`
- Overdue detection: appointments that passed their date without being marked complete are flagged
- Closest upcoming appointments shown first

### 📊 Analytics
- Filter by period (Daily, Weekly, Monthly, All Time)
- Filter by doctor and status
- Bar charts: appointments by treatment, by doctor, by status, by patient gender
- Overdue status shown in the filtered appointments table

### 🖥️ Dashboard
- Real-time total patient count
- Real-time today's scheduled appointment count
- Quick navigation to all sections

### 🔄 Auto-Update
- Squirrel.Windows auto-updater integrated
- App checks GitHub Releases on every launch
- Silent background download, user prompted to restart when ready
- Client never needs to manually reinstall after the first setup

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Desktop Shell | Electron |
| Frontend | React 19 |
| Database | SQLite via `better-sqlite3` |
| Bundler | Vite |
| Packaging | Electron Forge + Squirrel.Windows |
| Auto-update | `electron-updater` + GitHub Releases |
| IPC | Electron `contextBridge` + `ipcMain` / `ipcRenderer` |

---

## 📁 Project Structure

```
src/
├── main.js                      # Electron main process, IPC handlers, auto-updater
├── preload.js                   # contextBridge API exposure
├── db/
│   ├── database.jsx             # AppDatabase class, all SQL query methods
│   └── lib.jsx                  # Business logic handlers called by IPC
├── components/
│   ├── PatientForm.jsx
│   ├── AppointmentCard.jsx
│   ├── PatientDetailModal.jsx
│   ├── AssignAppointmentModal.jsx
│   ├── Header.jsx
│   └── NavButton.jsx
├── pages/
│   ├── AddPatientPage.jsx
│   ├── SearchPatientPage.jsx
│   ├── AppointmentsPage.jsx
│   ├── AnalyticsPage.jsx
│   ├── Dashboard.jsx
│   └── DatabasePage.jsx
└── Screens/
    ├── MainScreen.jsx
    └── SplashScreen.jsx
assets/
└── icon.ico
screenshots/
├── dashboard.png
├── add-patient.png
├── search.png
├── appointments.png
├── analytics.png
└── detail.png
```

---

## ⚙️ Local Development Setup

```bash
# Clone the repository
git clone https://github.com/Azharelahi/Family-Dental-Clinic.git
cd Family-Dental-Clinic

# Install dependencies
npm install

# Start in development mode
npm start
```

---

## 📦 Building and Publishing

```bash
# Build installer only (no publish)
npm run make

# Build and publish to GitHub Releases
# This triggers auto-update on all client machines
$env:GITHUB_TOKEN = "your_classic_token_here"
npm run publish
```

> Always bump the version in `package.json` before publishing. Squirrel compares version numbers to determine if an update is available.

---

## 🔄 Release Workflow

```
1. Make changes locally
2. Bump version in package.json  →  1.0.1 → 1.0.2
3. Set GitHub token in terminal
4. Run: npm run publish
5. Client machines auto-detect and download silently on next launch
```

No sending files. No client action. No reinstall.

---

## 🔒 Data and Privacy

| Property | Detail |
|---|---|
| Storage location | `C:\Users\<name>\AppData\Roaming\family-dental-clinic\familyDental.db` |
| External transmission | None — fully offline |
| On uninstall | Database is preserved |
| Backup | Copy `familyDental.db` from the path above |

All patient data lives exclusively on the clinic's local machine. No cloud. No third-party server. No subscription.

---

## 👥 Credits

| Role | Name |
|---|---|
| Architecture and Development | [Azhar Elahi](https://github.com/Azharelahi) |
| Development and Collaboration | Safiullah |
| Client and Domain Expert | Dr. Abdullah Niaz, Family Dental Clinic Cantt Abbottabad |

---

## 📄 License

MIT — built for a real client, shared for the community.

---

<p align="center">
  Built with care for a real clinic. Not a tutorial project.
</p>
