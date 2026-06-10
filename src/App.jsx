import { useState } from "react";
import SplashScreen     from "./screens/SplashScreen";
import MainScreen       from "./screens/MainScreen";
import AddPatientPage   from "./pages/AddPatientPage";
import SearchPatientPage from "./pages/SearchPatientPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import AnalyticsPage    from "./pages/AnalyticsPage";

/**
 * App.jsx — Central navigation controller
 * Pages: splash | main | add-patient | search | appointments | analytics
 * To migrate to React Router: replace setPage() calls with useNavigate()
 * and wrap pages in <Route path="..." element={...} />
 */

export default function App() {
  const [page, setPage] = useState("splash");

  const navigate = (target) => setPage(target);
  const goHome   = () => setPage("main");

  return (
    <div style={{ width: "100%", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {page === "splash"       && <SplashScreen      onComplete={() => navigate("main")} />}
      {page === "main"         && <MainScreen         onNavigate={navigate} />}
      {page === "add-patient"  && <AddPatientPage     onBack={goHome} />}
      {page === "search"       && <SearchPatientPage  onBack={goHome} />}
      {page === "appointments" && <AppointmentsPage   onBack={goHome} />}
      {page === "analytics"    && <AnalyticsPage      onBack={goHome} />}
    </div>
  );
}