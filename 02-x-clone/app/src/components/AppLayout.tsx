import { Link, Outlet } from "react-router-dom";

export function AppLayout() {
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
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
