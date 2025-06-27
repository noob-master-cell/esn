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

// Error link to handle GraphQL and network errors
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `🔥 GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    if (networkError) {
      console.error(`🌐 Network error: ${networkError}`);
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