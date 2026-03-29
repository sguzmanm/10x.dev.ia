import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AppRoutes } from "../app-routes";

const { authStateMock, signOutMock, getProfileByUserIdMock, updateDisplayNameMock } = vi.hoisted(() => ({
  authStateMock: {
    isInitializing: false,
    isAuthenticated: true,
    user: { id: "user-1", email: "user@example.com" },
  },
  signOutMock: vi.fn(),
  getProfileByUserIdMock: vi.fn(),
  updateDisplayNameMock: vi.fn(),
}));

vi.mock("../features/auth/auth-context", () => ({
  useAuth: () => ({ ...authStateMock, signOut: signOutMock }),
}));

vi.mock("../features/tweet/tweet-repository", () => ({
  listLatestTweets: vi.fn().mockResolvedValue([]),
  createTweet: vi.fn(),
}));

vi.mock("../features/profile/profile-repository", () => ({
  listVisibleProfiles: vi.fn().mockResolvedValue([]),
  getProfileByUserId: getProfileByUserIdMock,
  updateDisplayName: updateDisplayNameMock,
}));

vi.mock("../features/follow/follow-repository", () => ({
  listFollowingIds: vi.fn().mockResolvedValue([]),
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
}));

function renderWithRouter(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("App routing and layout", () => {
  beforeEach(() => {
    getProfileByUserIdMock.mockResolvedValue({
      userId: "user-1",
      username: "alice",
      displayName: "Alice",
      bio: null,
      avatarUrl: null,
    });
    updateDisplayNameMock.mockResolvedValue({
      userId: "user-1",
      username: "alice",
      displayName: "Alice Updated",
      bio: null,
      avatarUrl: null,
    });
  });

  it("shows Home when path is /", () => {
    renderWithRouter(["/"]);
    expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeInTheDocument();
  });

  it("redirects authenticated users from /login to /tweets", async () => {
    renderWithRouter(["/login"]);
    expect(await screen.findByRole("heading", { level: 1, name: "Tweets" })).toBeInTheDocument();
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

  it("navigates to tweets when clicking Login while authenticated", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/"]);
    await user.click(screen.getByRole("link", { name: "Login" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Tweets" })).toBeInTheDocument();
  });

  it("navigates to Tweets when clicking the Tweets nav link", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/"]);
    await user.click(screen.getByRole("link", { name: "Tweets" }));
    expect(screen.getByRole("heading", { level: 1, name: "Tweets" })).toBeInTheDocument();
  });

  it("opens display name modal from header username and saves", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/"]);

    const usernameButton = await screen.findByRole("button", { name: "@alice" });
    await user.click(usernameButton);

    const input = screen.getByLabelText("Display name");
    await user.clear(input);
    await user.type(input, "Alice Updated");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(updateDisplayNameMock).toHaveBeenCalledWith("user-1", "Alice Updated");
    expect(await screen.findByText("Alice Updated")).toBeInTheDocument();
  });
});
