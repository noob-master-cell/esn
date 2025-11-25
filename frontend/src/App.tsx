import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AppRoutes } from "./routes";
import { useAuth0 } from "@auth0/auth0-react";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import { setTokenGetter } from "./lib/apollo";
import { useEffect } from "react";
import { initGA } from "./utils/analytics";
import { usePageTracking } from "./hooks/usePageTracking";

import "./App.css";
import "./styles/App.css";

// Conditional Navbar - hides on admin routes
const ConditionalNavbar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  return <Navbar />;
};

function AppContent() {
  const { isLoading, getAccessTokenSilently } = useAuth0();
  const location = useLocation();

  // Initialize Google Analytics
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
    if (measurementId) {
      initGA(measurementId);
    }
  }, []);

  // Set up Apollo token getter
  useEffect(() => {
    setTokenGetter(() => getAccessTokenSilently());
  }, [getAccessTokenSilently]);

  // Track page views automatically
  usePageTracking();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600 font-medium">
            Loading authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ScrollToTop />
      <Analytics />
      <ConditionalNavbar />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      {!location.pathname.startsWith('/admin') && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
