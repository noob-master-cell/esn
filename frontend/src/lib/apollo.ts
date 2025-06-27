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

  // Get Clerk session token (not JWT) if available
  if (typeof window !== "undefined" && window.Clerk?.session) {
    try {
      // Get the session token specifically for backend verification
      token = await window.Clerk.session.getToken();
    } catch (error) {
      // Intentionally suppress errors to not clutter the console
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error link to handle GraphQL and network errors
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      // Handle GraphQL errors, but do not log to console to remove debugging
    }

    if (networkError) {
      // Handle network errors, but do not log to console to remove debugging
    }
  }
);

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
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