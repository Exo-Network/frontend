import { Ion } from "cesium";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { CesiumPage } from "./pages/CesiumPage";
import { GroundStationPage } from "./pages/GroundStations/GroundStation";
import { Home } from "./pages/Home/Home";
import { SpacecraftPage } from "./pages/Spacecraft/Spacecraft";
import Account from "./pages/Account/Account";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

function AppContent() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spacecraft" element={<SpacecraftPage />} />
        <Route path="/ground-stations" element={<GroundStationPage />} />
        <Route path="/account" element={<Account />} />
        {/* Add more routes as needed */}
        <Route path="/cesium" element={<CesiumPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
