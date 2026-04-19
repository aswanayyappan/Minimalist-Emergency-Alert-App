import { createBrowserRouter } from "react-router";
import { AppRoot } from "./AppRoot";
import { Landing } from "./pages/Landing";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppRoot,
    children: [
      { index: true, Component: Landing },
      { path: "signup", Component: SignUp },
      { path: "dashboard", Component: Dashboard },
    ],
  },
]);
