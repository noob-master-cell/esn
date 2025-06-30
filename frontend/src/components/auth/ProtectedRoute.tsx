// frontend/src/components/auth/ProtectedRoute.tsx
import React from "react";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_MY_PROFILE } from "../../lib/graphql/users";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallback,
}) => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const { data: profileData, loading: profileLoading } = useQuery(
    GET_MY_PROFILE,
    {
      skip: !user,
    }
  );

  // Loading state
  if (!isLoaded || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user has required roles
  const hasRequiredRole = () => {
    if (requiredRoles.length === 0) return true;

    const userRole = profileData?.myProfile?.role;
    if (!userRole) return false;

    return requiredRoles.includes(userRole);
  };

  const AccessDeniedPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🚫</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. Please contact an
          administrator if you believe this is an error.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Go Back
          </button>
        </div>
        {requiredRoles.length > 0 && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Required roles:</span>{" "}
              {requiredRoles.join(", ")}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Your role:</span>{" "}
              {profileData?.myProfile?.role || "None"}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const SignInPrompt = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔐</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Sign In Required
        </h1>
        <p className="text-gray-600 mb-8">
          You need to sign in to access this page.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/sign-in")}
            className="w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SignedIn>
        {hasRequiredRole() ? children : fallback || <AccessDeniedPage />}
      </SignedIn>
      <SignedOut>
        <SignInPrompt />
      </SignedOut>
    </>
  );
};
