import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/auth-context";
import { getErrorMessage } from "../features/shared/supabase-error";

export function AppLayout() {
  const { isAuthenticated, signOut, user } = useAuth();

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      // Basic handling keeps app usable without introducing a global toast system.
      window.alert(getErrorMessage(error));
    }
  }

  return (
    <div className="min-h-screen bg-x-bg text-x-text">
      <header className="border-b border-x-border bg-x-bg/80 backdrop-blur-sm">
        <nav
          className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3"
          aria-label="Main"
        >
          <Link className="font-semibold text-x-accent hover:underline" to="/">
            Home
          </Link>
          <Link className="font-semibold text-x-accent hover:underline" to="/login">
            Login
          </Link>
          <Link className="font-semibold text-x-accent hover:underline" to="/tweets">
            Tweets
          </Link>
          <div className="ml-auto flex items-center gap-3 text-sm text-x-muted">
            {isAuthenticated ? (
              <>
                <span>{user?.email}</span>
                <button className="font-semibold text-x-accent hover:underline" onClick={handleSignOut} type="button">
                  Sign out
                </button>
              </>
            ) : (
              <span>Not signed in</span>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
