import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { LegalProvider } from './contexts/LegalContext';
import { NotificationProvider } from './contexts/NotificationContext';
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
import AutoMissionGeneratorPage from './pages/AutoMissionGeneratorPage';
import TestGeneratorPage from './pages/test-generator';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import ErrorBoundary from './components/common/ErrorBoundary';
import PrivateRoute from './components/auth/PrivateRoute';
import TrainingPageIndependent from './pages/TrainingPageIndependent';
import TrainingPageDecoupled from './pages/TrainingPageDecoupled';
import TrainingSessionPageNew from './pages/TrainingSessionPageNew';
import TrainingValidationPage from './pages/TrainingValidationPage';
import NotificationsPage from './pages/NotificationsPage';
import Workshop1IntelligentPage from './pages/Workshop1IntelligentPage';

import RequestMonitor from './components/security/RequestMonitor';

// 🛡️ FLAG DE SÉCURITÉ POUR LE MODULE FORMATION
const TRAINING_MODULE_ENABLED = import.meta.env.VITE_TRAINING_MODULE_ENABLED !== 'false';

function App() {
  return (
    <AuthProvider>
        <LegalProvider>
          <NotificationProvider>
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
                  <Route path="/missions/:missionId" element={<PrivateRoute><AppLayout><Layout><EbiosDashboard /></Layout></AppLayout></PrivateRoute>} />

                  {/* 🤖 GÉNÉRATEUR AUTOMATIQUE DE MISSIONS */}
                  <Route path="/auto-generator" element={<PrivateRoute><AppLayout><AutoMissionGeneratorPage /></AppLayout></PrivateRoute>} />
                  <Route path="/test-generator" element={<TestGeneratorPage />} />

                  {/* 🎓 MODULE FORMATION INTERACTIVE (CONDITIONNEL) */}
                  {TRAINING_MODULE_ENABLED && (
                    <>
                      <Route path="/training" element={<PrivateRoute><AppLayout><Layout><TrainingPageIndependent /></Layout></AppLayout></PrivateRoute>} />
                      <Route path="/training-decoupled" element={<PrivateRoute><AppLayout><Layout><TrainingPageDecoupled /></Layout></AppLayout></PrivateRoute>} />
                      <Route path="/training/session/:sessionId" element={<PrivateRoute><AppLayout><TrainingSessionPageNew /></AppLayout></PrivateRoute>} />
                      <Route path="/training/new" element={<PrivateRoute><AppLayout><Layout><TrainingPageIndependent /></Layout></AppLayout></PrivateRoute>} />
                      <Route path="/training/validation" element={<PrivateRoute><TrainingValidationPage /></PrivateRoute>} />

                      {/* 🎯 NOUVEAU MODULE WORKSHOP 1 INTELLIGENT */}
                      <Route path="/training/workshop1" element={<PrivateRoute><AppLayout><Layout><Workshop1IntelligentPage /></Layout></AppLayout></PrivateRoute>} />
                      <Route path="/training/workshop1/:sessionId" element={<PrivateRoute><AppLayout><Layout><Workshop1IntelligentPage /></Layout></AppLayout></PrivateRoute>} />
                    </>
                  )}

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

                  {/* 🔔 PAGE DES NOTIFICATIONS */}
                  <Route path="/notifications" element={<PrivateRoute><AppLayout><NotificationsPage /></AppLayout></PrivateRoute>} />
                </Routes>
                <NavigationButtons />
                {/* 🛡️ Moniteur de sécurité temporairement désactivé */}
                {/* {import.meta.env.DEV && <RequestMonitor />} */}
              </div>
            </Router>
          </ErrorBoundary>
        </NotificationProvider>
      </LegalProvider>
    </AuthProvider>
  );
}

export default App;