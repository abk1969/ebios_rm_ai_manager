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
import Missions from './pages/Missions';
import Workshop1 from './pages/workshops/Workshop1';
import Workshop2 from './pages/workshops/Workshop2';
import Workshop3 from './pages/workshops/Workshop3';
import Workshop4 from './pages/workshops/Workshop4';
import Workshop5 from './pages/workshops/Workshop5';
import WorkshopRedirect from './components/workshops/WorkshopRedirect';
import WorkshopsIndex from './pages/WorkshopsIndex';
import EbiosReport from './pages/EbiosReport';
import EbiosDashboard from './pages/EbiosDashboard';
import DashboardRedirect from './components/dashboard/DashboardRedirect';
import RiskMonitoring from './pages/RiskMonitoring';
import CommunicationHub from './pages/CommunicationHub';
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
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
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
                  <Route path="/app" element={<PrivateRoute><AppLayout><Layout><Missions /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/dashboard" element={<PrivateRoute><AppLayout><Layout><Missions /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/ebios-dashboard" element={<PrivateRoute><AppLayout><DashboardRedirect /></AppLayout></PrivateRoute>} />
                  <Route path="/ebios-dashboard/:missionId" element={<PrivateRoute><AppLayout><Layout><EbiosDashboard /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/missions" element={<PrivateRoute><AppLayout><Layout><Missions /></Layout></AppLayout></PrivateRoute>} />

                  {/* 🔧 CORRECTION: Page d'index des workshops */}
                  <Route path="/workshops" element={<PrivateRoute><AppLayout><Layout><WorkshopsIndex /></Layout></AppLayout></PrivateRoute>} />

                  {/* 🔧 ROUTES UNIFIÉES: Seules les routes avec missionId sont conservées */}
                  <Route path="/workshops/:missionId/1" element={<PrivateRoute><AppLayout><Layout><Workshop1 /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshops/:missionId/2" element={<PrivateRoute><AppLayout><Layout><Workshop2 /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshops/:missionId/3" element={<PrivateRoute><AppLayout><Layout><Workshop3 /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshops/:missionId/4" element={<PrivateRoute><AppLayout><Layout><Workshop4 /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshops/:missionId/5" element={<PrivateRoute><AppLayout><Layout><Workshop5 /></Layout></AppLayout></PrivateRoute>} />

                  {/* 🔧 REDIRECTIONS INTELLIGENTES: Anciennes routes avec gestion automatique */}
                  <Route path="/workshop-1" element={<PrivateRoute><AppLayout><Layout><WorkshopRedirect workshopNumber={1}><Workshop1 /></WorkshopRedirect></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshop-2" element={<PrivateRoute><AppLayout><Layout><WorkshopRedirect workshopNumber={2}><Workshop2 /></WorkshopRedirect></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshop-3" element={<PrivateRoute><AppLayout><Layout><WorkshopRedirect workshopNumber={3}><Workshop3 /></WorkshopRedirect></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshop-4" element={<PrivateRoute><AppLayout><Layout><WorkshopRedirect workshopNumber={4}><Workshop4 /></WorkshopRedirect></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/workshop-5" element={<PrivateRoute><AppLayout><Layout><WorkshopRedirect workshopNumber={5}><Workshop5 /></WorkshopRedirect></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/ebios-report" element={<PrivateRoute><AppLayout><Layout><EbiosReport /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/ebios-report/:missionId" element={<PrivateRoute><AppLayout><Layout><EbiosReport /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/reports" element={<PrivateRoute><AppLayout><Layout><EbiosReport /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/risk-monitoring" element={<PrivateRoute><AppLayout><Layout><RiskMonitoring /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/communication" element={<PrivateRoute><AppLayout><Layout><CommunicationHub /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/continuous-improvement" element={<PrivateRoute><AppLayout><Layout><CommunicationHub /></Layout></AppLayout></PrivateRoute>} />
                  <Route path="/strategic-planning" element={<PrivateRoute><AppLayout><Layout><CommunicationHub /></Layout></AppLayout></PrivateRoute>} />
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