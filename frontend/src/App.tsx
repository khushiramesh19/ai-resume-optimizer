import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardOverview } from './pages/DashboardOverview';
import { AnalyzeResumePage } from './pages/AnalyzeResumePage';
import { AnalysisResultsPage } from './pages/AnalysisResultsPage';
import { MyResumesPage } from './pages/MyResumesPage';
import { InterviewCoachPage } from './pages/InterviewCoachPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Shell */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/analyze" element={<AnalyzeResumePage />} />
          <Route path="/results/:id" element={<AnalysisResultsPage />} />
          <Route path="/resumes" element={<MyResumesPage />} />
          <Route path="/interview-coach" element={<InterviewCoachPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
