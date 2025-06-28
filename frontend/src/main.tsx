import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/apollo";
import App from "./App";
import "./index.css";
import "./styles/Clerk.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </ClerkProvider>
  </React.StrictMode>
);