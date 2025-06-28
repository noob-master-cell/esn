// frontend/src/App.tsx
import React from "react";
// Note: Import react-router-dom components in your actual file
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton, 
  useUser,
} from "@clerk/clerk-react";
import { Alert } from "./components/ui/Alert";
import { Button } from "./components/ui/Button";
import { ClerkGraphQLTest } from "./components/ClerkGraphQLTest";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import { Footer } from "./components/layout/Footer";
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

  // Enhanced signed-out landing with modern design
  const SignedOutLanding = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="landing-pattern"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#landing-pattern)"
          />
        </svg>
      </div>

      <div className="relative px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ESN Community
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto">
              Discover amazing events, connect with the ESN community, and make
              unforgettable memories during your exchange experience.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/sign-up">
                <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:from-blue-500 hover:to-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 hover:scale-105">
                  Join Community
                </button>
              </Link>
              <Link to="/sign-in">
                <button className="rounded-2xl border-2 border-gray-300 bg-white/70 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-gray-900 shadow-sm hover:bg-white hover:border-gray-400 transition-all duration-200 hover:scale-105">
                  Sign In
                </button>
              </Link>
            </div>

            {/* Features */}
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">50+ Events</h3>
                <p className="text-sm text-gray-600">Join amazing events every month</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Network</h3>
                <p className="text-sm text-gray-600">Connect with students worldwide</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">25+ Countries</h3>
                <p className="text-sm text-gray-600">Experience diverse cultures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
              <p className="text-gray-600 font-medium">Loading authentication...</p>
            </div>
          </div>
        </ClerkLoading>

        <ClerkLoaded>
          {/* Enhanced Header with Modern User Button */}
          <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link to="/" className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ESN Events
                    </h1>
                  </div>
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
                    <span className="hidden sm:inline text-gray-700 font-medium">
                      Welcome, {user?.firstName}!
                    </span>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "h-10 w-10 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-colors",
                          userButtonTrigger: "focus:shadow-none hover:scale-105 transition-transform",
                          userButtonPopoverCard: "shadow-2xl border border-gray-200 rounded-2xl",
                          userButtonPopoverActionButton: "hover:bg-blue-50 rounded-xl",
                        },
                      }}
                    />
                  </SignedIn>
                  <SignedOut>
                    <Link to="/sign-in">
                      <Button variant="outline" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link to="/sign-up">
                      <Button size="sm">Register</Button>
                    </Link>
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
                      <HomePage />
                    </SignedIn>
                    <SignedOut>
                      <SignedOutLanding />
                    </SignedOut>
                  </>
                }
              />

              {/* Auth Routes */}
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />

              {/* Other Routes */}
              <Route path="/events" element={<EventsPage />} />
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