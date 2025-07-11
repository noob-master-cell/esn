// frontend/src/pages/auth/SignInPage.tsx
import * as React from "react";
import { ClerkAuthWrapper } from "../../components/auth/ClerkAuthWrapper";

const SignInPage: React.FC = () => {
  return <ClerkAuthWrapper mode="sign-in" />;
};

export default SignInPage;
