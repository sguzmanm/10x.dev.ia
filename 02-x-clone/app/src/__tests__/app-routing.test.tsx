import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "../app-routes";

function renderWithRouter(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("App routing and layout", () => {
  it("shows Home when path is /", () => {
    renderWithRouter(["/"]);
    expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeInTheDocument();
  });

  it("shows Login when path is /login", () => {
    renderWithRouter(["/login"]);
    expect(screen.getByRole("heading", { level: 1, name: "Log in" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("shows Tweets when path is /tweets", () => {
    renderWithRouter(["/tweets"]);
    expect(screen.getByRole("heading", { level: 1, name: "Tweets" })).toBeInTheDocument();
    expect(screen.getByLabelText(/what's happening/i)).toBeInTheDocument();
  });

  it("navigates to Home when clicking the Home nav link", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/tweets"]);
    await user.click(screen.getByRole("link", { name: "Home" }));
    expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeInTheDocument();
  });

  it("navigates to Login when clicking the Login nav link", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/"]);
    await user.click(screen.getByRole("link", { name: "Login" }));
    expect(screen.getByRole("heading", { level: 1, name: "Log in" })).toBeInTheDocument();
  });

  it("navigates to Tweets when clicking the Tweets nav link", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/"]);
    await user.click(screen.getByRole("link", { name: "Tweets" }));
    expect(screen.getByRole("heading", { level: 1, name: "Tweets" })).toBeInTheDocument();
  });
});
