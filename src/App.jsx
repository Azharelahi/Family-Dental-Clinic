


import { useState } from "react";
import SplashScreen from "./Screens/SplashScreen";
import MainScreen from "./Screens/MainScreen";
import AddPatientPage from "./pages/AddPatientPage";
import SearchPatientPage from "./pages/SearchPatientPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import DatabasePage from "./pages/DatabasePage";

/**
 * App.jsx — Central navigation controller
 *
 * Navigation is handled through a simple page-state string.
 * To swap in React Router later, replace navigate/onBack calls
 * with useNavigate() hooks and <Route> definitions.
 *
 * Pages:
 *   "splash"       → SplashScreen (auto-transitions)
 *   "main"         → MainScreen / Dashboard
 *   "add-patient"  → AddPatientPage
 *   "search"       → SearchPatientPage
 *   "appointments" → AppointmentsPage
 *   "database"     → DatabasePage
 */

export default function App() {
  const [page, setPage] = useState("splash");

  const navigate = (target) => setPage(target);
  const goHome = () => setPage("main");

  // Global page-transition wrapper
  const pageStyle = {
    width: "100%",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  };

  return (
    <div style={pageStyle}>
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
        <SearchPatientPage onBack={goHome} />
      )}

      {page === "appointments" && (
        <AppointmentsPage onBack={goHome} />
      )}

      {page === "database" && (
        <DatabasePage onBack={goHome} />
      )}
    </div>
  );
}