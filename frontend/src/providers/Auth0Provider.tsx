import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

interface Auth0ProviderWrapperProps {
  children: React.ReactNode;
}

export function Auth0ProviderWrapper({ children }: Auth0ProviderWrapperProps) {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  console.log("Auth0 Configuration:", {
    domain,
    clientId: clientId ? `${clientId.substring(0, 8)}...` : "undefined",
    audience,
    redirectUri: window.location.origin,
  });

  if (!domain || !clientId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Auth0 Configuration Missing
          </h2>
          <div className="text-left bg-gray-100 p-4 rounded text-sm">
            <p className="font-medium mb-2">Current values:</p>
            <p>Domain: {domain || "undefined"}</p>
            <p>Client ID: {clientId || "undefined"}</p>
            <p>Audience: {audience || "undefined"}</p>
            <p>Redirect URI: {window.location.origin}</p>
          </div>
        </div>
      </div>
    );
  }

  // Clear any existing Auth0 state on errors
  const handleRedirectCallback = (appState?: any, user?: any) => {
    console.log("Auth0 Redirect Callback:", { appState, user });

    // On successful callback, redirect to home
    window.history.replaceState({}, document.title, "/");
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: "openid profile email",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      onRedirectCallback={handleRedirectCallback}
      skipRedirectCallback={window.location.search.includes("error=")}
    >
      {children}
    </Auth0Provider>
  );
}
