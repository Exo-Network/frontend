import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { CesiumPage } from "./pages/CesiumPage";
import { Layout } from "./components/Layout";
import { Ion } from "cesium";
import { DashboardPage } from "./pages/Dashboard/Dashboard";
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cesium" element={<CesiumPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
