import { FormEvent } from "react";

export function LoginPage() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-bold">Log in</h1>
      <form className="space-y-4 rounded-2xl border border-x-border bg-x-surface p-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="w-full rounded-lg border border-x-border bg-x-bg px-3 py-2 text-x-text outline-none ring-x-accent focus:ring-2"
            id="email"
            name="email"
            type="email"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            autoComplete="current-password"
            className="w-full rounded-lg border border-x-border bg-x-bg px-3 py-2 text-x-text outline-none ring-x-accent focus:ring-2"
            id="password"
            name="password"
            type="password"
          />
        </div>
        <button
          className="w-full rounded-full bg-x-accent py-2 font-semibold text-white hover:bg-x-accent/90"
          type="submit"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
