import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { TweetsPage } from "../TweetsPage";

function renderTweets() {
  return render(
    <MemoryRouter initialEntries={["/tweets"]}>
      <Routes>
        <Route path="/tweets" element={<TweetsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("TweetsPage compose validation", () => {
  it("shows empty error when posting blank text", async () => {
    const user = userEvent.setup();
    renderTweets();
    await user.click(screen.getByRole("button", { name: "Post" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/cannot be empty/i);
  });

  it("shows length error when text exceeds 280 characters", async () => {
    const user = userEvent.setup();
    renderTweets();
    const field = screen.getByLabelText(/what's happening/i);
    await user.clear(field);
    await user.type(field, "a".repeat(281));
    await user.click(screen.getByRole("button", { name: "Post" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/exceeds 280/i);
  });

  it("clears validation errors for valid text", async () => {
    const user = userEvent.setup();
    renderTweets();
    await user.click(screen.getByRole("button", { name: "Post" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    const field = screen.getByLabelText(/what's happening/i);
    await user.type(field, "Hello world");
    await user.click(screen.getByRole("button", { name: "Post" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
