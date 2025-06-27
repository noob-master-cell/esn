import { useQuery } from "@apollo/client";
import { useAuth } from "@clerk/clerk-react";
import {
  ME_QUERY,
  HELLO_QUERY,
  HEALTH_CHECK_QUERY,
} from "../lib/graphql/queries";
import { Button } from "./ui/Button";

export function ClerkGraphQLTest() {
  const { isSignedIn, getToken } = useAuth();

  // Test queries
  const { data: healthData, loading: healthLoading } =
    useQuery(HEALTH_CHECK_QUERY);
  const {
    data: meData,
    loading: meLoading,
    error: meError,
    refetch: refetchMe,
  } = useQuery(ME_QUERY, {
    skip: !isSignedIn,
  });
  const {
    data: helloData,
    loading: helloLoading,
    error: helloError,
    refetch: refetchHello,
  } = useQuery(HELLO_QUERY, {
    skip: !isSignedIn,
  });

  const handleRefresh = () => {
    if (isSignedIn) {
      refetchMe();
      refetchHello();
    }
  };

  const handleShowToken = async () => {
    if (isSignedIn) {
      try {
        const token = await getToken();
        console.log("Clerk Token:", token);
        alert("Token logged to console");
      } catch (error) {
        console.error("Error getting token:", error);
      }
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">GraphQL + Clerk Test</h2>

      {/* Health Check (No Auth Required) */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-medium text-gray-900 mb-2">
          Health Check (No Auth)
        </h3>
        {healthLoading ? (
          <p className="text-blue-600">Loading...</p>
        ) : (
          <p className="text-green-600">✅ {healthData?.healthCheck}</p>
        )}
      </div>

      {!isSignedIn ? (
        <div className="text-center py-4">
          <p className="text-gray-600 mb-4">
            Please sign in to test authenticated GraphQL queries
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Control Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleRefresh} size="sm">
              Refresh Queries
            </Button>
            <Button onClick={handleShowToken} variant="outline" size="sm">
              Show Token
            </Button>
          </div>

          {/* Me Query */}
          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-medium text-blue-900 mb-2">Me Query</h3>
            {meLoading ? (
              <p className="text-blue-600">Loading user data...</p>
            ) : meError ? (
              <div className="text-red-600">
                <p className="font-medium">❌ Error:</p>
                <p className="text-sm">{meError.message}</p>
              </div>
            ) : meData?.me ? (
              <div className="text-green-600">
                <p className="font-medium">✅ User Data Retrieved:</p>
                <div className="mt-2 text-sm space-y-1">
                  <p>
                    <strong>Name:</strong> {meData.me.firstName}{" "}
                    {meData.me.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {meData.me.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {meData.me.role}
                  </p>
                  {meData.me.university && (
                    <p>
                      <strong>University:</strong> {meData.me.university}
                    </p>
                  )}
                  <p>
                    <strong>ESN Card:</strong>{" "}
                    {meData.me.esnCardVerified
                      ? "✅ Verified"
                      : "❌ Not verified"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No user data</p>
            )}
          </div>

          {/* Hello Query */}
          <div className="p-4 bg-green-50 rounded">
            <h3 className="font-medium text-green-900 mb-2">Hello Query</h3>
            {helloLoading ? (
              <p className="text-green-600">Loading...</p>
            ) : helloError ? (
              <div className="text-red-600">
                <p className="font-medium">❌ Error:</p>
                <p className="text-sm">{helloError.message}</p>
              </div>
            ) : (
              <p className="text-green-600">✅ {helloData?.hello}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
