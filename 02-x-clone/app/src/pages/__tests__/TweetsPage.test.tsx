import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Profile, Tweet } from "../../features/shared/models";
import { TweetsPage } from "../TweetsPage";

const {
  listLatestTweetsMock,
  createTweetMock,
  listVisibleProfilesMock,
  listFollowingIdsMock,
  followUserMock,
  unfollowUserMock,
  authStateMock,
} = vi.hoisted(() => ({
  listLatestTweetsMock: vi.fn(),
  createTweetMock: vi.fn(),
  listVisibleProfilesMock: vi.fn(),
  listFollowingIdsMock: vi.fn(),
  followUserMock: vi.fn(),
  unfollowUserMock: vi.fn(),
  authStateMock: {
    isInitializing: false,
    isAuthenticated: true,
    user: { id: "user-1", email: "user@example.com" },
  },
}));

vi.mock("../../features/auth/auth-context", () => ({
  useAuth: () => authStateMock,
}));

vi.mock("../../features/tweet/tweet-repository", () => ({
  listLatestTweets: listLatestTweetsMock,
  createTweet: createTweetMock,
}));

vi.mock("../../features/profile/profile-repository", () => ({
  listVisibleProfiles: listVisibleProfilesMock,
}));

vi.mock("../../features/follow/follow-repository", () => ({
  listFollowingIds: listFollowingIdsMock,
  followUser: followUserMock,
  unfollowUser: unfollowUserMock,
}));

const SAMPLE_TWEETS: Tweet[] = [
  {
    id: "tweet-1",
    authorId: "user-2",
    authorUsername: "bob",
    authorDisplayName: "Bob",
    body: "first",
    parentTweetId: null,
    rootTweetId: "tweet-1",
    createdAt: "2026-01-01T00:00:00Z",
  },
];

const SAMPLE_PROFILES: Profile[] = [
  {
    userId: "user-2",
    username: "bob",
    displayName: "Bob",
    bio: "ship it",
    avatarUrl: null,
  },
];

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
  beforeEach(() => {
    listLatestTweetsMock.mockResolvedValue(SAMPLE_TWEETS);
    createTweetMock.mockResolvedValue(SAMPLE_TWEETS[0]);
    listVisibleProfilesMock.mockResolvedValue(SAMPLE_PROFILES);
    listFollowingIdsMock.mockResolvedValue([]);
    followUserMock.mockResolvedValue(undefined);
    unfollowUserMock.mockResolvedValue(undefined);
  });

  it("shows empty error when posting blank text", async () => {
    const user = userEvent.setup();
    renderTweets();
    await screen.findByText("first");
    await user.click(screen.getByRole("button", { name: "Post" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/cannot be empty/i);
  });

  it("shows length error when text exceeds 280 characters", async () => {
    const user = userEvent.setup();
    renderTweets();
    await screen.findByText("first");
    const field = screen.getByLabelText(/what's happening/i);
    await user.clear(field);
    await user.type(field, "a".repeat(281));
    await user.click(screen.getByRole("button", { name: "Post" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/exceeds 280/i);
  });

  it("clears validation errors for valid text", async () => {
    const user = userEvent.setup();
    renderTweets();
    await screen.findByText("first");
    await user.click(screen.getByRole("button", { name: "Post" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    const field = screen.getByLabelText(/what's happening/i);
    await user.type(field, "Hello world");
    await user.click(screen.getByRole("button", { name: "Post" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(createTweetMock).toHaveBeenCalledWith({
      authorId: "user-1",
      body: "Hello world",
    });
  });

  it("toggles follow state for visible profiles", async () => {
    const user = userEvent.setup();
    renderTweets();

    const followButton = await screen.findByRole("button", { name: "Follow" });
    await user.click(followButton);

    expect(followUserMock).toHaveBeenCalledWith("user-1", "user-2");
    expect(await screen.findByRole("button", { name: "Unfollow" })).toBeInTheDocument();
  });

  it("links authors to their public profile pages", async () => {
    renderTweets();

    const tweetAuthorLinks = await screen.findAllByRole("link", { name: /@bob/i });
    expect(tweetAuthorLinks[0]).toHaveAttribute("href", "/profile/bob");

    const peopleAuthorLinks = screen.getAllByRole("link", { name: "Bob" });
    expect(peopleAuthorLinks[0]).toHaveAttribute("href", "/profile/bob");
  });
});
