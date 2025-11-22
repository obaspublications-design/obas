import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SiteProvider, useSite } from './context/SiteContext';
import { Layout } from './components/Layout';
import { Home, ServicesPage, ResourcesPage, ProcessPage, ContactPage } from './pages/PublicPages';
import { AdminLogin, AdminDashboard } from './pages/AdminDashboard';
import { HelmetProvider } from 'react-helmet-async';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useSite();
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <SiteProvider>
          <AppContent />
        </SiteProvider>
      </Router>
    </HelmetProvider>
  );
};

export default App;