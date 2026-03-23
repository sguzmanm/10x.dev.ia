import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { HomePage } from "../HomePage";

function renderHome() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  it("renders links to /tweets and /login", () => {
    renderHome();
    expect(screen.getByRole("link", { name: "Open feed" })).toHaveAttribute("href", "/tweets");
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
  });
});
