import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PublicProfilePage } from "../PublicProfilePage";

const { getProfileByUsernameMock } = vi.hoisted(() => ({
  getProfileByUsernameMock: vi.fn(),
}));

vi.mock("../../features/profile/profile-repository", () => ({
  getProfileByUsername: getProfileByUsernameMock,
}));

function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/profile/:username" element={<PublicProfilePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Caso de uso: Perfil publico", () => {
  beforeEach(() => {
    getProfileByUsernameMock.mockReset();
  });

  it("DEBE mostrar datos del perfil cuando existe username", async () => {
    getProfileByUsernameMock.mockResolvedValue({
      userId: "user-1",
      username: "alice",
      displayName: "Alice",
      bio: "building",
      avatarUrl: null,
    });

    renderRoute("/profile/alice");

    expect(await screen.findByRole("heading", { level: 1, name: "Alice" })).toBeInTheDocument();
    expect(screen.getByText("@alice")).toBeInTheDocument();
    expect(screen.getByText("building")).toBeInTheDocument();
  });

  it("DEBE mostrar not found cuando username no existe", async () => {
    getProfileByUsernameMock.mockResolvedValue(null);

    renderRoute("/profile/missing");

    expect(await screen.findByText("Profile not found.")).toBeInTheDocument();
  });
});
