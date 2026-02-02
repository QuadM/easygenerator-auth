import {
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import App from "./App";
import SignIn from "./modules/auth/presentation/SignIn";
import SignUp from "./modules/auth/presentation/SignUp";
import Profile from "./modules/auth/presentation/Profile";

// 1. Root route acts as the layout (App)
const rootRoute = createRootRoute({
  component: App,
});

// 2. Child routes (Paths must start with /)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <div className="flex flex-col items-center justify-center pt-20">
      <p className="text-muted-foreground">
        Welcome — use Sign In / Sign Up to authenticate.
      </p>
    </div>
  ),
});

const signinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signin", // Added leading slash
  component: SignIn,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup", // Added leading slash
  component: SignUp,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/me", // Added leading slash
  component: Profile,
});

// 3. Build the tree
const routeTree = rootRoute.addChildren([indexRoute, signinRoute, signupRoute, profileRoute]);

// 4. Create and export the router
export const router = createRouter({ routeTree });

// 5. Register for Type Safety (Crucial for TanStack)
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
