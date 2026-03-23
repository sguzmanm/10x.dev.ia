import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Home</h1>
      <p className="max-w-xl text-x-muted">
        A minimal X-style experience: browse the feed or sign in to continue.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded-full bg-x-accent px-5 py-2 font-semibold text-white hover:bg-x-accent/90"
          to="/tweets"
        >
          Open feed
        </Link>
        <Link
          className="rounded-full border border-x-border px-5 py-2 font-semibold hover:bg-x-surface"
          to="/login"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
