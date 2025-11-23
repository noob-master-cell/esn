import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient, setTokenGetter } from "./lib/apollo";
import App from "./App";
import "./index.css";

// Safe console.error override to avoid installHook TypeError
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  try {
    const safeArgs = args.map(arg => {
      if (arg instanceof Error) return arg.message;
      if (typeof arg === "object" && arg !== null) {
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return arg;
    });
    originalConsoleError(...safeArgs);
  } catch (e) {
    originalConsoleError("Error while logging:", e);
  }
};

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

// Component to set up token getter for Apollo
const Auth0TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    // Set up the token getter for Apollo client
    if (isAuthenticated) {
      setTokenGetter(async () => {
        try {
          return await getAccessTokenSilently();
        } catch (error) {
          console.error("Failed to get access token:", error);
          return null;
        }
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: AUTH0_AUDIENCE,
        scope: "openid profile email",
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <Auth0TokenProvider>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </Auth0TokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);