import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SiteProvider, useSite } from './context/SiteContext';
import { Layout } from './components/Layout';
import { Home, ServicesPage, ResourcesPage, ProcessPage, ContactPage } from './pages/PublicPages';
import { AdminLogin, AdminDashboard } from './pages/AdminDashboard';
import { HelmetProvider } from 'react-helmet-async';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useSite();
  
  // If not admin, redirect to login
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main Content Wrapper to use Site Context within Router
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
        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

// Root App Component
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