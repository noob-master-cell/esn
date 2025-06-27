import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "./ui/Button";

export function ClerkDebugTest() {
  const { isSignedIn, getToken } = useAuth();
  const [debugResult, setDebugResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testClerkToken = async () => {
    if (!isSignedIn) {
      alert("Please sign in first");
      return;
    }

    setLoading(true);
    try {
      // Get session token from Clerk (this is what backend expects)
      const token = await getToken();
      console.log("🔑 Debug: Got session token from Clerk");
      console.log("🔑 Debug: Token preview:", token?.substring(0, 50) + "...");

      if (!token) {
        setDebugResult({ error: "No session token received from Clerk" });
        return;
      }

      // Test direct API call to our debug endpoint
      const response = await fetch("http://localhost:4000/auth/debug", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("🔍 Debug endpoint result:", result);
      setDebugResult(result);
    } catch (error) {
      console.error("❌ Debug test failed:", error);
      setDebugResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testTokenVerification = async () => {
    if (!isSignedIn) {
      alert("Please sign in first");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      console.log("🔑 Verification test: Using session token");

      const response = await fetch("http://localhost:4000/auth/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      console.log("🔍 Token verification result:", result);
      setDebugResult(result);
    } catch (error) {
      console.error("❌ Token verification test failed:", error);
      setDebugResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const showTokenDetails = async () => {
    if (!isSignedIn) {
      alert("Please sign in first");
      return;
    }

    try {
      const token = await getToken();

      // Decode JWT payload (without verification, just for debugging)
      if (token) {
        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));

        console.log("🔍 Token payload:", payload);
        setDebugResult({
          tokenPresent: true,
          tokenLength: token.length,
          payload: payload,
          tokenPreview: token.substring(0, 50) + "...",
        });
      }
    } catch (error) {
      console.error("❌ Token details failed:", error);
      setDebugResult({ error: error.message });
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        Clerk Debug Test (Modern JWT)
      </h2>

      {!isSignedIn ? (
        <p className="text-gray-600">
          Please sign in to test Clerk authentication
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex space-x-2 flex-wrap gap-2">
            <Button onClick={testClerkToken} loading={loading} size="sm">
              Test Debug Endpoint
            </Button>
            <Button
              onClick={testTokenVerification}
              loading={loading}
              variant="outline"
              size="sm"
            >
              Test Token Verification
            </Button>
            <Button
              onClick={showTokenDetails}
              loading={loading}
              variant="outline"
              size="sm"
            >
              Show Token Details
            </Button>
          </div>

          {debugResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Debug Result:</h3>
              <pre className="text-sm overflow-auto max-h-96">
                {JSON.stringify(debugResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
