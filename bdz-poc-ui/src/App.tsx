import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { store } from './store/store';
import theme from './styles/theme';
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import CustomerLoginPage from './pages/CustomerLoginPage'
import CashierDashboard from './pages/CashierDashboard'
import TicketIssuance from './pages/TicketIssuance'
import CustomerProfilePage from './pages/CustomerProfilePage'
import TravelInfoPage from './pages/TravelInfoPage'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import SearchResultsPage from './pages/SearchResultsPage'
import SchedulePage from './pages/SchedulePage'
import LanguageSelection from './components/LanguageSelection/LanguageSelection'
import MainMenu from './components/MainMenu/MainMenu'
import AccessibilitySettings from './components/AccessibilitySettings/AccessibilitySettings'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import './i18n/config'
import TicketSelection from './components/TicketSelection/TicketSelection'
import TicketSearch from './components/TicketSearch/TicketSearch'
import TrainSelectionStep from './components/tickets/TrainSelectionStep'
import Step4 from './components/tickets/Step4'
import TrainDetailsPage from './pages/TrainDetailsPage'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(error => {
      console.log('SW registration failed:', error);
    });
  });
}

const AppRoutes: React.FC = () => {
  const { language, fontSize, isHighContrast, themeMode } = useSelector(
    (state: RootState) => state.settings
  );

  // Apply accessibility settings
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.body.classList.toggle('high-contrast', isHighContrast);
  }, [fontSize, isHighContrast]);

  return (
    <Routes>
      {/* Initial Language Selection */}
      <Route path="/" element={<LanguageSelection />} />

      {/* Main Menu - shown after language selection */}
      <Route path="/menu" element={<MainMenu />} />

      {/* Accessibility Settings */}
      <Route path="/accessibility" element={<AccessibilitySettings />} />

      {/* Language Selection */}
      <Route path="/language" element={<LanguageSelection />} />

      {/* Public routes */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/cashier-login" element={<LoginPage />} />
      <Route path="/customer-login" element={<CustomerLoginPage />} />
      <Route path="/travel-info" element={<TravelInfoPage />} />
      <Route path="/search-results" element={<SearchResultsPage />} />
      <Route path="/profile" element={<CustomerProfilePage />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/ticket/type" element={<TicketSelection />} />
      <Route path="/ticket/search" element={<TicketSearch />} />
      <Route path="/ticket/train-selection" element={<TrainSelectionStep />} />
      <Route path="/ticket/step4" element={<Step4 />} />
      <Route path="/train-details" element={<TrainDetailsPage />} />

      {/* Protected routes */}
      <Route
        path="/cashier/*"
        element={
          <ProtectedRoute>
            <Routes>
              <Route path="dashboard" element={<CashierDashboard />} />
              <Route path="tickets" element={<TicketIssuance />} />
              {/* Add more cashier routes here */}
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Redirect all other routes to language selection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  )
}

export default App
