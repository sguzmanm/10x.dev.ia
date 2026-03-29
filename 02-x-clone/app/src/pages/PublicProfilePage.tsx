import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProfileByUsername } from "../features/profile/profile-repository";
import { getErrorMessage } from "../features/shared/supabase-error";

export function PublicProfilePage() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getProfileByUsername>>>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!username) {
        if (mounted) {
          setIsLoading(false);
          setProfile(null);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextProfile = await getProfileByUsername(username);
        if (mounted) {
          setProfile(nextProfile);
        }
      } catch (loadError) {
        if (mounted) {
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [username]);

  if (isLoading) {
    return <p className="text-x-muted">Loading profile...</p>;
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
        <Link className="font-semibold text-x-accent hover:underline" to="/tweets">
          Back to Tweets
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-x-muted">Profile not found.</p>
        <Link className="font-semibold text-x-accent hover:underline" to="/tweets">
          Back to Tweets
        </Link>
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-x-border bg-x-surface p-5">
      <h1 className="text-2xl font-semibold">{profile.displayName}</h1>
      <p className="text-sm text-x-muted">@{profile.username}</p>
      {profile.bio ? <p className="mt-3 whitespace-pre-wrap">{profile.bio}</p> : <p className="mt-3 text-x-muted">No bio yet.</p>}
    </article>
  );
}
