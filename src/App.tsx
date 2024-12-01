import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { LegalProvider } from './contexts/LegalContext';
import NavigationButtons from './components/NavigationButtons';
import AppLayout from './components/AppLayout';
import Layout from './components/Layout';
import LandingPage from './pages/landing/LandingPage';
import Features from './pages/Features';
import Register from './pages/auth/Register';
import SignIn from './pages/auth/SignIn';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import Workshop1 from './pages/workshops/Workshop1';
import Workshop2 from './pages/workshops/Workshop2';
import Workshop3 from './pages/workshops/Workshop3';
import Workshop4 from './pages/workshops/Workshop4';
import Workshop5 from './pages/workshops/Workshop5';
import Settings from './pages/Settings';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import ErrorBoundary from './components/common/ErrorBoundary';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <LegalProvider>
          <ErrorBoundary>
            <Router>
              <div className="min-h-screen relative">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<SignIn />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  
                  {/* Protected routes */}
                  <Route path="/app" element={<PrivateRoute><AppLayout><Layout><Dashboard /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/missions" element={<PrivateRoute><AppLayout><Layout><Missions /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshop-1" element={<PrivateRoute><AppLayout><Layout><Workshop1 /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshop-2" element={<PrivateRoute><AppLayout><Layout><Workshop2 /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshop-3" element={<PrivateRoute><AppLayout><Layout><Workshop3 /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshop-4" element={<PrivateRoute><AppLayout><Layout><Workshop4 /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshop-5" element={<PrivateRoute><AppLayout><Layout><Workshop5 /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/settings" element={<PrivateRoute><AppLayout><Layout><Settings /></Layout></AppLayout></PrivateRoute>} />
                </Routes>
                <NavigationButtons />
              </div>
            </Router>
          </ErrorBoundary>
        </LegalProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;