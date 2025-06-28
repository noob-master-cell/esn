// frontend/src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { Alert } from "./components/ui/Alert";
import { ClerkGraphQLTest } from "./components/ClerkGraphQLTest";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import DashboardPage from "./pages/DashboardPage"; // Import the new page
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import "./App.css";
import "./styles/App.css";

function App() {
  const { user } = useUser();

  // Debug page component
  const DebugPage = () => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <Alert
          type="success"
          title="Welcome back!"
          message={`You are successfully logged in as ${user?.firstName} ${user?.lastName}`}
        />
        <ClerkGraphQLTest />
      </div>
    </main>
  );

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <ClerkLoading>
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
        </ClerkLoading>

        <ClerkLoaded>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <SignedIn>
                      <HomePage />
                    </SignedIn>
                    <SignedOut>
                      <HomePage />
                    </SignedOut>
                  </>
                }
              />

              {/* Auth Routes */}
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />

              {/* Events Routes */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />

              {/* Dashboard Route - Protected */}
              <Route
                path="/dashboard"
                element={
                  <SignedIn>
                    <DashboardPage />
                  </SignedIn>
                }
              />

              {/* Debug Route */}
              <Route path="/debug" element={<DebugPage />} />
            </Routes>
          </main>

          <Footer />
        </ClerkLoaded>
      </div>
    </Router>
  );
}

export default App;