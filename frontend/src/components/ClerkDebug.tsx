import React from "react";
import { useAuth, useUser } from "@clerk/clerk-react";

export function ClerkDebug() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const testToken = async () => {
    try {
      const token = await getToken();
      console.log("Debug - Full token:", token);

      // Also test the session token
      if (window.Clerk?.session) {
        const sessionToken = await window.Clerk.session.getToken();
        console.log("Debug - Session token:", sessionToken);
      }
    } catch (error) {
      console.error("Debug - Token error:", error);
    }
  };

  if (!isLoaded) {
    return <div>Loading Clerk...</div>;
  }

  return (
    <div className="p-4 bg-yellow-50 rounded">
      <h3 className="font-bold">Clerk Debug Info</h3>
      <p>Loaded: {isLoaded ? "✅" : "❌"}</p>
      <p>Signed In: {isSignedIn ? "✅" : "❌"}</p>
      <p>User ID: {user?.id || "None"}</p>
      <p>Email: {user?.primaryEmailAddress?.emailAddress || "None"}</p>
      <button
        onClick={testToken}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Token
      </button>
    </div>
  );
}
