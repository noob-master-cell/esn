import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PublicRouteProps {
    children: React.ReactNode;
}

/**
 * PublicRoute - Prevents authenticated users from accessing auth pages
 * Redirects authenticated users to the home page
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { isLoaded, isSignedIn } = useAuth();

    // Show nothing while checking auth status
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        );
    }

    // If user is authenticated, redirect to home page
    if (isSignedIn) {
        return <Navigate to="/" replace />;
    }

    // User is not authenticated, show the auth page
    return <>{children}</>;
};
