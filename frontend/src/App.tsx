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

// Public Pages
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import EventRegistrationPage from "./pages/EventRegistrationPage";
import ProfilePage from "./pages/ProfilePage";

// Auth Pages
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";

// Admin Pages
import { AdminEventsPage } from "./pages/admin/AdminEventsPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminRegistrationsPage } from "./pages/admin/AdminRegistrationsPage";
import { EventCreatePage } from "./pages/admin/EventCreatePage";
import { EventEditPage } from "./pages/admin/EventEditPage";

// Layout Components
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import "./App.css";
import "./styles/App.css";
import { AdminDashboardPage } from "./pages/admin/AdminDashboard";

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
              {/* Public Routes */}
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

              {/* Protected User Routes */}
              <Route
                path="/events/:id/register"
                element={
                  <ProtectedRoute>
                    <EventRegistrationPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes - Protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN"]}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute
                    requiredRoles={["ADMIN", "SUPER_ADMIN", "ORGANIZER"]}
                  >
                    <AdminEventsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/events/create"
                element={
                  <ProtectedRoute
                    requiredRoles={["ADMIN", "SUPER_ADMIN", "ORGANIZER"]}
                  >
                    <EventCreatePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/events/:id/edit"
                element={
                  <ProtectedRoute
                    requiredRoles={["ADMIN", "SUPER_ADMIN", "ORGANIZER"]}
                  >
                    <EventEditPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN"]}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/registrations"
                element={
                  <ProtectedRoute
                    requiredRoles={["ADMIN", "SUPER_ADMIN", "ORGANIZER"]}
                  >
                    <AdminRegistrationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Future Admin Routes */}
              <Route
                path="/admin/payments"
                element={
                  <ProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN"]}>
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Payments Management
                      </h2>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN"]}>
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Analytics Dashboard
                      </h2>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute requiredRoles={["SUPER_ADMIN"]}>
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        System Settings
                      </h2>
                      <p className="text-gray-600">Coming soon...</p>
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Debug Route */}
              <Route path="/debug" element={<DebugPage />} />

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🔍</div>
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Page Not Found
                      </h1>
                      <p className="text-gray-600 mb-8">
                        The page you're looking for doesn't exist.
                      </p>
                      <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer />
        </ClerkLoaded>
      </div>
    </Router>
  );
}

export default App;
