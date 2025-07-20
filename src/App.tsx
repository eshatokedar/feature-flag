import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/Login'; 
import HomePage from './pages/Home';   
import { FeatureFlagProvider } from './contexts/FeatureFlagContext';

const isAuthenticated = localStorage.getItem('auth') === 'true';

export default function App() {
  return (
    <FeatureFlagProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Router>
    </FeatureFlagProvider>
  );
}
