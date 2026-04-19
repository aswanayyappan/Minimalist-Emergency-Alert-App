import { Outlet } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";

export function AppRoot() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
