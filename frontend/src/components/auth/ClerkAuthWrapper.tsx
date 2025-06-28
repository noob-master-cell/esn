// frontend/src/components/auth/ClerkAuthWrapper.tsx
import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";

interface ClerkAuthWrapperProps {
  mode: "sign-in" | "sign-up";
}

export const ClerkAuthWrapper: React.FC<ClerkAuthWrapperProps> = ({ mode }) => {
  const appearance = {
    elements: {
      rootBox: "w-full",
      card: "bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl",
      headerTitle: "text-2xl font-bold text-gray-900 mb-2",
      headerSubtitle: "text-gray-600 text-base",
      formButtonPrimary:
        "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 hover:scale-[1.02] shadow-lg",
      formFieldInput:
        "rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 px-4 py-3 text-gray-900 bg-white/80",
      footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold",
      dividerLine: "bg-gray-200",
      dividerText: "text-gray-500 text-sm",
      socialButtonsBlockButton:
        "border-2 border-gray-200 hover:border-blue-300 rounded-2xl py-3 px-4 transition-all duration-200 hover:scale-[1.02] bg-white/90 hover:bg-white",
      formFieldLabel: "text-gray-700 font-medium text-sm mb-2",
      identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
      formHeaderTitle: "text-gray-900 font-bold text-xl",
      formHeaderSubtitle: "text-gray-600",
      otpCodeFieldInput:
        "rounded-xl border-2 border-gray-200 focus:border-blue-500 text-center font-semibold text-lg",
      formResendCodeLink: "text-blue-600 hover:text-blue-700 font-medium",
      alertText: "text-red-600 text-sm",
      formFieldWarningText: "text-amber-600 text-sm",
      formFieldSuccessText: "text-green-600 text-sm",
      formFieldInfoText: "text-blue-600 text-sm",
    },
    layout: {
      socialButtonsVariant: "blockButton" as const,
      socialButtonsPlacement: "top" as const,
    },
    variables: {
      colorPrimary: "#3B82F6",
      colorSuccess: "#10B981",
      colorWarning: "#F59E0B",
      colorDanger: "#EF4444",
      fontFamily: "Inter, system-ui, sans-serif",
      borderRadius: "1rem",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-blue-200/50 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="auth-pattern"
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
            fill="url(#auth-pattern)"
          />
        </svg>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-indigo-400/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl mb-6 border border-white/30 shadow-lg">
            <svg
              className="w-8 h-8 text-blue-600"
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

          {/* Title */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ESN Community
          </h1>
          <p className="text-gray-600 text-base max-w-sm mx-auto">
            {mode === "sign-in"
              ? "Welcome back! Continue your journey with us."
              : "Join thousands of students in the ESN community."}
          </p>
        </div>

        {/* Clerk Auth Component */}
        <div className="mb-8">
          {mode === "sign-in" ? (
            <SignIn appearance={appearance} redirectUrl="/" />
          ) : (
            <SignUp appearance={appearance} redirectUrl="/" />
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
            <div className="w-8 h-8 mx-auto mb-2 text-blue-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-600 font-medium">50+ Events</p>
          </div>
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
            <div className="w-8 h-8 mx-auto mb-2 text-purple-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-600 font-medium">Community</p>
          </div>
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
            <div className="w-8 h-8 mx-auto mb-2 text-green-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-600 font-medium">25+ Countries</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
