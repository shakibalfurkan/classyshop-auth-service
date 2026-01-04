import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { router } from "./routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "./components/ui/sonner";
import AppInitializer from "./providers/AppInitializer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer>
        <Toaster />
        <RouterProvider router={router} />
      </AppInitializer>
    </Provider>
  </StrictMode>
);
