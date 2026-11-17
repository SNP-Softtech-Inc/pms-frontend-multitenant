

import React from "react";
import ReactDOM from "react-dom/client";
import { createPortal } from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Toaster } from "sonner";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { ConfirmProvider } from "./components/ConfirmDialogContext";
// ✅ Redux
import { Provider } from "react-redux";
import store from "./redux/store";

// ✅ MUI Theme
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";

// ✅ Font (IMPORTANT for professional UI)
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
       <BrowserRouter basename={process.env.REACT_APP_BASE_PATH}>
         <ToastProvider>
          <AuthProvider>
            
             <ConfirmProvider>
            <App />
            {/* <ToastContainer position="top-right" autoClose={3000} /> */}
             {/* v1.87.0: on <body>, beside the drawers and dialogs (which are
                 portaled there too), so its own z-index decides and a
                 message is never hidden behind a side panel. */}
             {createPortal(
               <Toaster
                    position="top-right"
                    richColors
                    closeButton
                    duration={3000}
                    theme="light"
                  />,
               document.body
             )}
            </ConfirmProvider>
           
          </AuthProvider>
           </ToastProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);

reportWebVitals();
