import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

// HTTP link to your GraphQL endpoint
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL || "http://localhost:4000/graphql",
});

// Auth link to add Clerk token to requests
const authLink = setContext(async (_, { headers }) => {
  let token = "";

  try {
    // Try to get token from Clerk
    if (typeof window !== "undefined" && window.Clerk?.session) {
      token = await window.Clerk.session.getToken();
      console.log(
        "🔑 Token obtained from Clerk:",
        token ? "✅ Success" : "❌ Failed"
      );
    }
  } catch (error) {
    console.error("❌ Error getting Clerk token:", error);
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Enhanced error link to handle GraphQL and network errors
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        console.error(
          `🔥 GraphQL error: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path ? JSON.stringify(path) : 'N/A'}`
        );
        
        // Handle specific null field errors
        if (message.includes('Cannot return null for non-nullable field')) {
          console.error('💀 Non-nullable field error detected:', {
            message,
            path,
            operation: operation.operationName,
            variables: operation.variables,
          });
          
          // You could potentially retry the operation or show a specific error message
          if (message.includes('registrationCount')) {
            console.error('🎯 Registration count error - this should be fixed in backend');
          }
        }
      });
    }

    if (networkError) {
      console.error(`🌐 Network error: ${networkError}`);
      
      // Handle specific network errors
      if (networkError.message?.includes('Failed to fetch')) {
        console.error('🔌 Backend server might be down');
      }
    }
  }
);

// Create Apollo Client with enhanced configuration
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Event: {
        fields: {
          // Ensure registrationCount always has a fallback value
          registrationCount: {
            read(existing) {
              return existing ?? 0;
            }
          },
          waitlistCount: {
            read(existing) {
              return existing ?? 0;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    },
  },
});