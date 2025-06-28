import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import esnLogo from "../../assets/favicon/mstile-70x70.png";

interface ClerkAuthWrapperProps {
  mode: "sign-in" | "sign-up";
}

export const ClerkAuthWrapper: React.FC<ClerkAuthWrapperProps> = ({ mode }) => {
  const appearance = {
    variables: {
      colorPrimary: "#4A4DFF",
      colorText: "#1F2937",
      colorTextSecondary: "#6B7280",
      colorBackground: "#FFFFFF",
      colorInputBackground: "#F9FAFB",
      colorInputText: "#1F2937",
      colorBorder: "#E5E7EB",
      borderRadius: "1.25rem",
    },
    elements: {
      rootBox: "w-full flex justify-center items-center",
      card: "shadow-2xl rounded-2xl border-none bg-white p-6 sm:p-10",
      headerTitle: "text-2xl sm:text-3xl font-bold text-gray-900",
      headerSubtitle: "text-gray-500 mt-2",
      formButtonPrimary:
        "bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg text-sm",
      formFieldLabel: "text-gray-700 font-medium text-sm",
      formFieldInput:
        "rounded-lg border-gray-200 bg-gray-50 focus:border-primary focus:ring-4 focus:ring-primary/10",
      dividerText: "text-gray-500",
      socialButtonsBlockButton:
        "border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-medium",
      footerActionText: "text-gray-600",
      footerActionLink: "text-primary hover:text-primary/90 font-semibold",
    },
  };

  return (
    <div className="auth-container">
      <div className="w-full max-w-md sm:max-w-lg mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6 mx-auto">
            <img src={esnLogo} alt="ESN Logo" className="h-full w-full" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {mode === "sign-in" ? "Welcome Back" : "Create your Account"}
          </h1>
          <p className="text-gray-600 mt-2 sm:mt-3 text-base sm:text-lg">
            {mode === "sign-in"
              ? "Sign in to continue to ESN"
              : "Join the ESN community to get started."}
          </p>
        </div>

        {mode === "sign-in" ? (
          <SignIn appearance={appearance} />
        ) : (
          <SignUp appearance={appearance} />
        )}
      </div>
    </div>
  );
};
