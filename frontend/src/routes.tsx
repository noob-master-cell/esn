import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';


// Public Pages
import HomePage from './pages/home';
import EventsPage from './pages/events';
import EventDetailsPage from './pages/events/EventDetailsPage';
import EventRegistrationPage from './pages/events/EventRegistrationPage';
import ProfilePage from './pages/profile';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Auth Pages
import SignInPage from './pages/auth/sign-in';
import SignUpPage from './pages/auth/sign-up';

// Admin Pages
const AdminDashboardPage = lazy(() => import('./pages/admin/dashboard/index.tsx'));
const AdminEventsPage = lazy(() => import('./pages/admin/events/index.tsx'));
const AdminUsersPage = lazy(() => import('./pages/admin/users/index.tsx'));
const AdminRegistrationsPage = lazy(() => import('./pages/admin/registrations/index.tsx'));
const EventCreatePage = lazy(() => import('./pages/admin/events/EventCreatePage.tsx'));
const EventEditPage = lazy(() => import('./pages/admin/events/EventEditPage.tsx'));
const AdminSettingsPage = lazy(() => import('./pages/admin/settings/index.tsx'));


export const AppRoutes: React.FC = () => (
    <Routes>
        {/* Public Routes */}

        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Auth Routes */}
        <Route
            path="/sign-in/*"
            element={
                <PublicRoute>
                    <SignInPage />
                </PublicRoute>
            }
        />
        <Route
            path="/sign-up/*"
            element={
                <PublicRoute>
                    <SignUpPage />
                </PublicRoute>
            }
        />

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

        {/* Admin Routes */}
        <Route
            path="/admin"
            element={
                <ProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN"]}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <AdminDashboardPage />
                    </Suspense>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/events"
            element={
                <ProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN", "ORGANIZER"]}>
                    <AdminEventsPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/events/create"
            element={
                <ProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN", "ORGANIZER"]}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <EventCreatePage />
                    </Suspense>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/events/:id/edit"
            element={
                <ProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN", "ORGANIZER"]}>
                    <EventEditPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/users"
            element={
                <ProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN"]}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <AdminUsersPage />
                    </Suspense>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/registrations"
            element={
                <ProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN", "ORGANIZER"]}>
                    <AdminRegistrationsPage />
                </ProtectedRoute>
            }
        />

        <Route
            path="/admin/settings"
            element={
                <ProtectedRoute requiredRoles={["ADMIN", "SUPER_ADMIN"]}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <AdminSettingsPage />
                    </Suspense>
                </ProtectedRoute>
            }
        />
        <Route path="/admin/settings/:section" element={<AdminSettingsPage />} />

        {/* Debug Route */}
        <Route path="/debug" element={<div>Debug Page Placeholder</div>} />

        {/* 404 Route */}
        <Route
            path="*"
            element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                        <p className="text-gray-600 mb-6">The page you’re looking for doesn’t exist.</p>
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
);