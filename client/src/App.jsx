import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppLayout from './components/AppLayout.jsx';
import ChatWidget from './components/chat/ChatWidget.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewSimulation from './pages/NewSimulation.jsx';
import SimulationResult from './pages/SimulationResult.jsx';
import CompareCrops from './pages/CompareCrops.jsx';
import History from './pages/History.jsx';
import Settings from './pages/Settings.jsx';
import CropDiseaseDetection from './pages/CropDiseaseDetection.jsx';
import Presentation from './pages/Presentation.jsx';
import MarketIntelligence from './pages/MarketIntelligence.jsx';
import Schemes from './pages/Schemes.jsx';
import IrrigationPlanner from './pages/IrrigationPlanner.jsx';
import PestAlerts from './pages/PestAlerts.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/presentation" element={<Presentation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simulate" element={<NewSimulation />} />
          <Route path="/disease" element={<CropDiseaseDetection />} />
          <Route path="/market" element={<MarketIntelligence />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/irrigation" element={<IrrigationPlanner />} />
          <Route path="/pest-alerts" element={<PestAlerts />} />
          <Route path="/results/:id" element={<SimulationResult />} />
          <Route path="/compare" element={<CompareCrops />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isAuthenticated && <ChatWidget />}
    </>
  );
}
