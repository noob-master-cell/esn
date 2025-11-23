import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AuthLayout } from "../../../components/auth/AuthLayout";

const SignUpPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <AuthLayout
      title="Get started"
      subtitle="Create your account to join the ESN community"
    >
      <button
        onClick={() => loginWithRedirect({
          authorizationParams: {
            screen_hint: "signup",
          },
          appState: {
            returnTo: window.location.pathname,
          },
        })}
        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
      >
        <span>Sign up with Auth0</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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

export default SignUpPage;
