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

// Token getter function - will be set by Auth0 provider
let getAccessToken: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (getter: () => Promise<string | null>) => {
  getAccessToken = getter;
};

// Auth link to add Auth0 token to requests
const authLink = setContext(async (_, { headers }) => {
  let token = "";

  try {
    if (getAccessToken) {
      token = (await getAccessToken()) || "";
    } else {
      console.warn("⚠️ Token getter not set - user may not be logged in");
    }
  } catch (error) {
    console.error("❌ Error getting Auth0 token:", error);
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
  ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        console.error(
          `🔴 GraphQL error: ${message}`,
          locations ? `at ${JSON.stringify(locations)}` : '',
          path ? `in path: ${JSON.stringify(path)}` : ''
        );

        // Check for specific non-nullable field errors
        if (message.includes('Cannot return null for non-nullable field')) {
          console.error('💀 Non-nullable field error detected:', {
            message,
            path,
            extensions: extensions ? JSON.stringify(extensions) : undefined
          });

          // Special handling for registrationCount errors
          if (message.includes('registrationCount')) {
            console.error('🎯 Registration count error - this should be fixed in backend');
          }
        }
      });
    }

    if (networkError) {
      console.error(`🌐 Network error: ${networkError.message || networkError}`);

      // Check if it's a connection refused error
      if (networkError.message?.includes('Failed to fetch') || networkError.message?.includes('ECONNREFUSED')) {
        console.error('🔌 Backend server might be down');
      }
    }
  },
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
      fetchPolicy: "network-only",
    },
  },
});