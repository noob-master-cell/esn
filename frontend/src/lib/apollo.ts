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
      console.log(
        "🔑 Apollo: Got session token from Clerk:",
        token ? "Token present" : "No token"
      );
    } catch (error) {
      console.warn("❌ Apollo: Could not get Clerk session token:", error);
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
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
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
