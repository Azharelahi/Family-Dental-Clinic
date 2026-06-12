import { useState } from "react";
import SplashScreen       from "./screens/SplashScreen";
import MainScreen         from "./screens/MainScreen";
import AddPatientPage     from "./pages/AddPatientPage";
import SearchPatientPage  from "./pages/SearchPatientPage";
import AppointmentsPage   from "./pages/AppointmentsPage";
import AnalyticsPage      from "./pages/AnalyticsPage";
import appointmentsRaw    from "./data/appointments";

/**
 * App.jsx — Central router + shared state owner
 *
 * Shared state lifted here so:
 *  - SearchPatientPage  can ADD  new appointments
 *  - AppointmentsPage   can READ / EDIT / DELETE appointments
 *  - AnalyticsPage      can READ appointments for stats
 *
 * Backend migration path:
 *   1. Replace useState(appointmentsRaw) with an API fetch (useEffect + window.api.getAppointments())
 *   2. Replace setter calls with window.api.createAppointment / updateAppointment / deleteAppointment
 *   3. Remove the data/appointments.js import
 *
 * Navigation:
 *   Replace setPage() with useNavigate() + <Route> when migrating to React Router.
 */

export default function App() {
  const [page, setPage] = useState("splash");

  // ── Shared appointments state ─────────────────────────────────────────────
  // TODO: initialise via API call → window.api.getAppointments()
  const [appointments, setAppointments] = useState(appointmentsRaw);

  const navigate = (target) => setPage(target);
  const goHome   = () => setPage("main");

  /** Called by SearchPatientPage when a new appointment is assigned */
  const handleAddAppointment = (newAppt) => {
    setAppointments((prev) => [newAppt, ...prev]);
  };

  return (
    <div style={{ width:"100%", minHeight:"100vh", fontFamily:"'Segoe UI', system-ui, sans-serif" }}>

      {page === "splash" && (
        <SplashScreen onComplete={() => navigate("main")} />
      )}

      {page === "main" && (
        <MainScreen onNavigate={navigate} />
      )}

      {page === "add-patient" && (
        <AddPatientPage onBack={goHome} />
      )}

      {page === "search" && (
        <SearchPatientPage
          onBack={goHome}
          appointments={appointments}
          onAddAppointment={handleAddAppointment}
        />
      )}

      {page === "appointments" && (
        <AppointmentsPage
          onBack={goHome}
          appointments={appointments}
          setAppointments={setAppointments}
        />
      )}

      {page === "analytics" && (
        <AnalyticsPage
          onBack={goHome}
          appointments={appointments}
        />
      )}

    </div>
  );
}