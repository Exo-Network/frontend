import { Ion } from "cesium";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { CesiumPage } from "./pages/CesiumPage";
import { GroundStationPage } from "./pages/GroundStations/GroundStation";
import { Home } from "./pages/Home/Home";
import { SpacecraftPage } from "./pages/Spacecraft/Spacecraft";
import Account from "./pages/Account/Account";
import { useApiData } from "./hooks/useApiData";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

function AppContent() {
  const { isLoading, error, isInitialized } = useApiData();

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isInitialized || isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" text="Loading satellite and ground station data..." />
        </div>
      </Layout>
    );
  }

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
