import { Outlet } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider } from "./context/AuthContext";

export function AppRoot() {
  return (
    <AuthProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AuthProvider>
  );
}
