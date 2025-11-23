import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AuthLayout } from "../../../components/auth/AuthLayout";

const SignInPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your account"
    >
      <button
        onClick={() => loginWithRedirect({
          appState: {
            returnTo: window.location.pathname,
          },
        })}
        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
      >
        <span>Sign in with Auth0</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Secure authentication powered by Auth0</span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignInPage;
