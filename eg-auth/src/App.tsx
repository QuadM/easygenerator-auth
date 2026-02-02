import { Outlet, Link } from "@tanstack/react-router";
import { useAuth } from "./modules/auth/hooks/useAuth";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const {  isAuthenticated } = useAuth();

  return (
    <>
      <div className="p-4 flex justify-between items-center gap-4">
        <img
          alt="easygenerator logo"
          src="https://assets.easygenerator.com/fragment/auth-page/2026.01.26.master-1af8781f44/bf10dbb9f41b2fbd0ce37ea061974c5b.svg"
        ></img>
        {!isAuthenticated && (
          <div>
            <Button variant="link" onClick={(e) => e.preventDefault()}>
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button variant="link" onClick={(e) => e.preventDefault()}>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>

      <div>
        <Outlet />
      </div>
      <Toaster />
    </>
  );
}
