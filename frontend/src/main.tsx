import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./app/store.js";
import { Provider } from "react-redux";

const quaryClient: QueryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={quaryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
