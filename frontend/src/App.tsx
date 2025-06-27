import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/clerk-react";
import { Alert } from "./components/ui/Alert";
import { Button } from "./components/ui/Button";
import { ClerkGraphQLTest } from "./components/ClerkGraphQLTest";

function App() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <ClerkLoading>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading authentication...</p>
          </div>
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">ESN Events</h1>
              </div>

              <div className="flex items-center space-x-4">
                <SignedIn>
                  <span className="text-gray-700">
                    Welcome, {user?.firstName}!
                  </span>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                      },
                    }}
                  />
                </SignedIn>

                <SignedOut>
                  <SignInButton>
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button size="sm">Register</Button>
                  </SignUpButton>
                </SignedOut>
              </div>
            </div>
          </div>
        </header>
        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SignedIn>
            <div className="space-y-6">
              <Alert
                type="success"
                title="Welcome back!"
                message={`You are successfully logged in as ${user?.firstName} ${user?.lastName}`}
              />

              {/* Add GraphQL Test Component */}
              <ClerkGraphQLTest />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to ESN Event Management
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Discover amazing events and connect with the ESN community
              </p>
              <div className="space-x-4">
                <SignUpButton>
                  <Button size="lg">Get Started</Button>
                </SignUpButton>
                <SignInButton>
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>

          {/* Always show GraphQL test for debugging */}
          <ClerkGraphQLTest />
        </main>
      </ClerkLoaded>
    </div>
  );
}

export default App;