import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { NotificationsProvider } from './hooks/useNotifications';
import theme from './theme';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PlanSelection from './pages/PlanSelection';
import APIKeys from './pages/APIKeys';
import Budget from './pages/Budget';
import Integration from './pages/Integration';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Semi-Protected Route (for plan selection - requires auth but allows access)
const SemiProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (for login/register - redirect to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationsProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Landing Page (public) */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />

                {/* Plan Selection (semi-protected) */}
                <Route
                  path="/plan-selection"
                  element={
                    <SemiProtectedRoute>
                      <PlanSelection />
                    </SemiProtectedRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Other Protected Routes */}
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                          <p className="text-gray-600 mt-2">Coming soon...</p>
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/budget"
                  element={
                    <ProtectedRoute>
                      <Budget />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/api-keys"
                  element={
                    <ProtectedRoute>
                      <APIKeys />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/integration"
                  element={
                    <ProtectedRoute>
                      <Integration />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/recommendations"
                  element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-2xl font-bold text-gray-900">Recommendations</h1>
                          <p className="text-gray-600 mt-2">Coming soon...</p>
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                          <p className="text-gray-600 mt-2">Coming soon...</p>
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                          <p className="text-gray-600 mt-2">Coming soon...</p>
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />

                {/* Legal Pages (public) */}
                <Route
                  path="/terms"
                  element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
                        <p className="text-gray-600 mt-2">Coming soon...</p>
                      </div>
                    </div>
                  }
                />

                <Route
                  path="/privacy"
                  element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
                        <p className="text-gray-600 mt-2">Coming soon...</p>
                      </div>
                    </div>
                  }
                />

                {/* Catch all route */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900">404</h1>
                        <p className="text-gray-600 mt-2">Page not found</p>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </div>
          </Router>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
