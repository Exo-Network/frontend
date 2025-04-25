import { Ion } from "cesium";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { SpacecraftPage } from "./pages/Spacecraft/Spacecraft";
import { Layout } from "./components/Layout/Layout";
import { CesiumPage } from "./pages/CesiumPage";
import { GroundStationPage } from "./pages/GroundStations/GroundStation";
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spacecraft" element={<SpacecraftPage />} />
          <Route path="/ground-stations" element={<GroundStationPage />} />
          {/* Add more routes as needed */}
          <Route path="/cesium" element={<CesiumPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
