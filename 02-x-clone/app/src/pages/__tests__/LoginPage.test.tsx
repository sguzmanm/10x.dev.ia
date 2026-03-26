import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "../LoginPage";

const { signInWithPasswordMock } = vi.hoisted(() => ({
  signInWithPasswordMock: vi.fn(),
}));

vi.mock("../../features/auth/auth-context", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    signInWithPassword: signInWithPasswordMock,
  }),
}));

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/tweets" element={<div>Tweets destination</div>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    signInWithPasswordMock.mockReset();
  });

  it("renders email, password, and Sign in button", () => {
    renderLogin();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("submits credentials and navigates to tweets on success", async () => {
    const user = userEvent.setup();
    signInWithPasswordMock.mockResolvedValue(undefined);
    renderLogin();
    await user.type(screen.getByLabelText("Email"), "alice@example.com");
    await user.type(screen.getByLabelText("Password"), "secret");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: "alice@example.com",
      password: "secret",
    });
    expect(await screen.findByText("Tweets destination")).toBeInTheDocument();
  });

  it("shows an error when auth fails", async () => {
    const user = userEvent.setup();
    signInWithPasswordMock.mockRejectedValue(new Error("Invalid credentials"));
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "alice@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/invalid credentials/i);
  });
});
