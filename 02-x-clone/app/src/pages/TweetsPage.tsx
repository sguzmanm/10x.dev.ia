import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/auth-context";
import { followUser, listFollowingIds, unfollowUser } from "../features/follow/follow-repository";
import { getErrorMessage } from "../features/shared/supabase-error";
import { validateTweetText } from "../features/tweet/tweet-validator";
import { createTweet, listLatestTweets } from "../features/tweet/tweet-repository";
import { listVisibleProfiles } from "../features/profile/profile-repository";

export function TweetsPage() {
  const { isAuthenticated, isInitializing, user } = useAuth();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [tweetsError, setTweetsError] = useState<string | null>(null);
  const [tweets, setTweets] = useState<Awaited<ReturnType<typeof listLatestTweets>>>([]);
  const [isLoadingTweets, setIsLoadingTweets] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [profilesError, setProfilesError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Awaited<ReturnType<typeof listVisibleProfiles>>>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [busyFollowUserId, setBusyFollowUserId] = useState<string | null>(null);

  const visibleProfiles = useMemo(
    () => profiles.filter((profile) => profile.userId !== user?.id),
    [profiles, user?.id],
  );

  async function loadTweets() {
    if (!isAuthenticated) {
      return;
    }

    setIsLoadingTweets(true);
    setTweetsError(null);

    try {
      const nextTweets = await listLatestTweets();
      setTweets(nextTweets);
    } catch (loadError) {
      setTweetsError(getErrorMessage(loadError));
    } finally {
      setIsLoadingTweets(false);
    }
  }

  async function loadProfilesAndFollows() {
    if (!user) {
      return;
    }

    setIsLoadingProfiles(true);
    setProfilesError(null);

    try {
      const [nextProfiles, nextFollowingIds] = await Promise.all([
        listVisibleProfiles(),
        listFollowingIds(user.id),
      ]);
      setProfiles(nextProfiles);
      setFollowingIds(nextFollowingIds);
    } catch (loadError) {
      setProfilesError(getErrorMessage(loadError));
    } finally {
      setIsLoadingProfiles(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setTweets([]);
      return;
    }

    void loadTweets();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProfiles([]);
      setFollowingIds([]);
      return;
    }

    void loadProfilesAndFollows();
  }, [isAuthenticated, user]);

  async function handlePost() {
    if (!user) {
      setError("You must be signed in to post.");
      return;
    }

    const result = validateTweetText(text);
    if (!result.valid) {
      setError(result.reason ?? "Invalid tweet");
      return;
    }

    setIsPosting(true);
    setError(null);

    try {
      await createTweet({
        authorId: user.id,
        body: text,
      });
      setText("");
      await loadTweets();
    } catch (postError) {
      setError(getErrorMessage(postError));
    } finally {
      setIsPosting(false);
    }
  }

  async function handleToggleFollow(targetUserId: string) {
    if (!user) {
      return;
    }

    const isFollowing = followingIds.includes(targetUserId);
    setBusyFollowUserId(targetUserId);
    setProfilesError(null);

    try {
      if (isFollowing) {
        await unfollowUser(user.id, targetUserId);
        setFollowingIds((prev) => prev.filter((id) => id !== targetUserId));
      } else {
        await followUser(user.id, targetUserId);
        setFollowingIds((prev) => [...prev, targetUserId]);
      }
    } catch (followError) {
      setProfilesError(getErrorMessage(followError));
    } finally {
      setBusyFollowUserId(null);
    }
  }

  if (isInitializing) {
    return <p className="text-x-muted">Loading session...</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Tweets</h1>
        <p className="text-x-muted">You need to sign in before reading or posting tweets.</p>
        <Link className="inline-flex rounded-full bg-x-accent px-5 py-2 font-semibold text-white hover:bg-x-accent/90" to="/login">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Tweets</h1>

      <section aria-label="Compose" className="rounded-2xl border border-x-border bg-x-surface p-4">
        <label className="sr-only" htmlFor="compose">
          What&apos;s happening?
        </label>
        <textarea
          className="mb-3 min-h-[100px] w-full resize-y rounded-xl border border-x-border bg-x-bg px-3 py-2 text-x-text outline-none ring-x-accent focus:ring-2"
          id="compose"
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          value={text}
        />
        {error ? (
          <p className="mb-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <button
          className="rounded-full bg-x-accent px-4 py-2 font-semibold text-white hover:bg-x-accent/90"
          disabled={isPosting}
          onClick={handlePost}
          type="button"
        >
          {isPosting ? "Posting..." : "Post"}
        </button>
      </section>

      <section aria-label="Feed">
        <h2 className="mb-3 text-lg font-semibold">Latest</h2>
        {tweetsError ? (
          <p className="mb-3 text-sm text-red-400" role="alert">
            {tweetsError}
          </p>
        ) : null}
        {isLoadingTweets ? <p className="text-sm text-x-muted">Loading tweets...</p> : null}
        <ul className="space-y-3">
          {tweets.map((tweet) => (
            <li
              className="rounded-2xl border border-x-border bg-x-bg px-4 py-3"
              key={tweet.id}
            >
              <p className="text-sm text-x-muted">
                @{tweet.authorUsername} · {tweet.authorDisplayName}
              </p>
              <p className="mt-1 whitespace-pre-wrap">{tweet.body}</p>
            </li>
          ))}
        </ul>
        {!isLoadingTweets && tweets.length === 0 ? <p className="text-sm text-x-muted">No tweets yet.</p> : null}
      </section>

      <section aria-label="People" className="rounded-2xl border border-x-border bg-x-surface p-4">
        <h2 className="mb-3 text-lg font-semibold">People</h2>
        {profilesError ? (
          <p className="mb-3 text-sm text-red-400" role="alert">
            {profilesError}
          </p>
        ) : null}
        {isLoadingProfiles ? <p className="text-sm text-x-muted">Loading profiles...</p> : null}
        <ul className="space-y-3">
          {visibleProfiles.map((profile) => {
            const isFollowing = followingIds.includes(profile.userId);
            const isBusy = busyFollowUserId === profile.userId;

            return (
              <li
                className="flex items-start justify-between gap-3 rounded-xl border border-x-border bg-x-bg px-4 py-3"
                key={profile.userId}
              >
                <div>
                  <p className="font-medium">{profile.displayName}</p>
                  <p className="text-sm text-x-muted">@{profile.username}</p>
                  {profile.bio ? <p className="mt-1 text-sm text-x-muted">{profile.bio}</p> : null}
                </div>
                <button
                  className="rounded-full border border-x-border px-3 py-1 text-sm font-semibold hover:bg-x-surface"
                  disabled={isBusy}
                  onClick={() => void handleToggleFollow(profile.userId)}
                  type="button"
                >
                  {isBusy ? "..." : isFollowing ? "Unfollow" : "Follow"}
                </button>
              </li>
            );
          })}
        </ul>
        {!isLoadingProfiles && visibleProfiles.length === 0 ? (
          <p className="text-sm text-x-muted">No visible profiles for this account yet.</p>
        ) : null}
      </section>
    </div>
  );
}
