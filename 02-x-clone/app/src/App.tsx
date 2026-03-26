import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./app-routes";
import { AuthProvider } from "./features/auth/auth-context";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
