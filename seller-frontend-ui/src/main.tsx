import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { router } from "./routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "./components/ui/sonner";
import AuthProvider from "./providers/AuthProvider";
import ShopProvider from "./providers/ShopProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ShopProvider>
          <Toaster />
          <RouterProvider router={router} />
        </ShopProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
