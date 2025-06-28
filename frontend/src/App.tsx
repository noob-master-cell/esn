// frontend/src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/clerk-react";
import { Alert } from "./components/ui/Alert";
import { Button } from "./components/ui/Button";
import { ClerkGraphQLTest } from "./components/ClerkGraphQLTest";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import { Footer } from "./components/layout/Footer";
import "./App.css"; // Fixed: Changed from "./styles/App.css" to "./App.css"
import "./styles/App.css";

function App() {
  const { user } = useUser();

  // Your original debug components, now wrapped for a dedicated page
  const DebugPage = () => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <Alert
          type="success"
          title="Welcome back!"
          message={`You are successfully logged in as ${user?.firstName} ${user?.lastName}`}
        />
        {/* Your GraphQL test component is preserved here */}
        <ClerkGraphQLTest />
      </div>
    </main>
  );

  // Your original landing page for signed-out users
  const SignedOutLanding = () => (
    <div className="text-center py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to ESN Event Management
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Discover amazing events and connect with the ESN community
      </p>
      <div className="space-x-4">
        <SignUpButton>
          <Button size="lg">Get Started</Button>
        </SignUpButton>
        <SignInButton>
          <Button variant="outline" size="lg">
            Sign In
          </Button>
        </SignInButton>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <ClerkLoading>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading authentication...</p>
            </div>
          </div>
        </ClerkLoading>

        <ClerkLoaded>
          {/* Updated Header with Events Link */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link to="/" className="flex items-center">
                  <h1 className="text-2xl font-bold text-blue-600">
                    ESN Events
                  </h1>
                </Link>

                {/* Enhanced Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/events"
                    className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    Events
                  </Link>
                  <SignedIn>
                    <Link
                      to="/debug"
                      className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                    >
                      Debug
                    </Link>
                  </SignedIn>
                </nav>

                <div className="flex items-center space-x-4">
                  <SignedIn>
                    <span className="hidden sm:inline text-gray-700">
                      Welcome, {user?.firstName}!
                    </span>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton>
                      <Button variant="outline" size="sm">
                        Login
                      </Button>
                    </SignInButton>
                    <SignUpButton>
                      <Button size="sm">Register</Button>
                    </SignUpButton>
                  </SignedOut>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-grow">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <SignedIn>
                      {/* The new styled homepage is shown when signed in */}
                      <HomePage />
                    </SignedIn>
                    <SignedOut>
                      {/* Your original landing page is shown when signed out */}
                      <SignedOutLanding />
                    </SignedOut>
                  </>
                }
              />

              {/* New Events Route */}
              <Route path="/events" element={<EventsPage />} />

              {/* Your debug page is available at the /debug route */}
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
