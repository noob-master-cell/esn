// frontend/src/components/auth/AuthLayout.tsx
import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";

interface AuthLayoutProps {
  mode: "sign-in" | "sign-up";
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ mode }) => {
  return (
    <div className="auth-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
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
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
          />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Floating Circle */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>

        {/* Medium Floating Circle */}
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

        {/* Small Floating Circles */}
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-purple-400/5 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-pink-400/5 rounded-full blur-2xl animate-pulse delay-3000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl mb-4 border border-white/20">
            <svg
              className="w-8 h-8 text-white"
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
          <h1 className="text-2xl font-bold text-white mb-2">ESN Community</h1>
          <p className="text-white/70 text-sm">
            {mode === "sign-in"
              ? "Welcome back! Please sign in to your account."
              : "Join the ESN community and start your journey."}
          </p>
        </div>

        {/* Auth Component */}
        <div className="auth-form-container">
          {mode === "sign-in" ? (
            <SignIn
              routing="path"
              path="/sign-in"
              redirectUrl="/dashboard"
              signUpUrl="/sign-up"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "auth-card shadow-2xl",
                },
              }}
            />
          ) : (
            <SignUp
              routing="path"
              path="/sign-up"
              redirectUrl="/dashboard"
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "auth-card shadow-2xl",
                },
              }}
            />
          )}
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="w-8 h-8 mx-auto mb-2 text-white/80">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <p className="text-xs text-white/70 font-medium">Community</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="w-8 h-8 mx-auto mb-2 text-white/80">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-xs text-white/70 font-medium">Events</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
            <div className="w-8 h-8 mx-auto mb-2 text-white/80">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-xs text-white/70 font-medium">Network</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-xs">
            By continuing, you agree to our{" "}
            <a href="#" className="text-white/70 hover:text-white underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-white/70 hover:text-white underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
