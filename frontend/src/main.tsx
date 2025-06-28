import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/apollo";
import { ThemeProvider } from "@material-tailwind/react"; // <-- Import ThemeProvider
import App from "./App";
import "./index.css";
import "./styles/Clerk.css";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      {" "}
      {/* <-- Wrap your entire application with ThemeProvider */}
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </ClerkProvider>
    </ThemeProvider>
  </React.StrictMode>
);
