import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/auth-context";
import { getProfileByUserId } from "../features/profile/profile-repository";
import type { Profile } from "../features/shared/models";
import { getErrorMessage } from "../features/shared/supabase-error";
import { EditDisplayNameModal } from "./EditDisplayNameModal";

export function AppLayout() {
  const { isAuthenticated, signOut, user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!isAuthenticated || !user?.id) {
        if (mounted) {
          setProfile(null);
        }
        return;
      }

      try {
        const nextProfile = await getProfileByUserId(user.id);
        if (mounted) {
          setProfile(nextProfile);
        }
      } catch {
        if (mounted) {
          setProfile(null);
        }
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user?.id]);

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      // Basic handling keeps app usable without introducing a global toast system.
      window.alert(getErrorMessage(error));
    }
  }

  return (
    <div className="min-h-screen bg-x-bg text-x-text">
      <header className="border-b border-x-border bg-x-bg/80 backdrop-blur-sm">
        <nav
          className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3"
          aria-label="Main"
        >
          <Link className="font-semibold text-x-accent hover:underline" to="/">
            Home
          </Link>
          <Link className="font-semibold text-x-accent hover:underline" to="/login">
            Login
          </Link>
          <Link className="font-semibold text-x-accent hover:underline" to="/tweets">
            Tweets
          </Link>
          <div className="ml-auto flex items-center gap-3 text-sm text-x-muted">
            {isAuthenticated ? (
              <>
                {profile ? (
                  <>
                    <button
                      className="font-semibold text-x-accent hover:underline"
                      onClick={() => setIsEditingDisplayName(true)}
                      type="button"
                    >
                      @{profile.username}
                    </button>
                    <span>{profile.displayName}</span>
                  </>
                ) : (
                  <span>{user?.email}</span>
                )}
                <button className="font-semibold text-x-accent hover:underline" onClick={handleSignOut} type="button">
                  Sign out
                </button>
              </>
            ) : (
              <span>Not signed in</span>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
      {profile && user ? (
        <EditDisplayNameModal
          currentDisplayName={profile.displayName}
          isOpen={isEditingDisplayName}
          onClose={() => setIsEditingDisplayName(false)}
          onProfileUpdated={setProfile}
          userId={user.id}
        />
      ) : null}
    </div>
  );
}
