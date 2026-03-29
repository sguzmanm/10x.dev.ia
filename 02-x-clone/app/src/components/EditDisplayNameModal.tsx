import { useEffect, useState } from "react";
import { updateDisplayName } from "../features/profile/profile-repository";
import { getErrorMessage } from "../features/shared/supabase-error";
import type { Profile } from "../features/shared/models";

interface EditDisplayNameModalProps {
  isOpen: boolean;
  userId: string;
  currentDisplayName: string;
  onClose: () => void;
  onProfileUpdated: (profile: Profile) => void;
}

export function EditDisplayNameModal({
  isOpen,
  userId,
  currentDisplayName,
  onClose,
  onProfileUpdated,
}: EditDisplayNameModalProps) {
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDisplayName(currentDisplayName);
      setError(null);
    }
  }, [currentDisplayName, isOpen]);

  async function handleSave() {
    const trimmed = displayName.trim();
    if (trimmed.length === 0) {
      setError("Display name cannot be empty.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updated = await updateDisplayName(userId, trimmed);
      onProfileUpdated(updated);
      onClose();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div aria-modal="true" className="w-full max-w-md rounded-2xl border border-x-border bg-x-bg p-4" role="dialog">
        <h2 className="text-xl font-semibold">Edit display name</h2>
        <label className="mt-3 block text-sm text-x-muted" htmlFor="display_name">
          Display name
        </label>
        <input
          className="mt-1 w-full rounded-xl border border-x-border bg-x-surface px-3 py-2 outline-none ring-x-accent focus:ring-2"
          id="display_name"
          onChange={(event) => setDisplayName(event.target.value)}
          type="text"
          value={displayName}
        />
        {error ? (
          <p className="mt-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded-full border border-x-border px-4 py-2 hover:bg-x-surface" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="rounded-full bg-x-accent px-4 py-2 font-semibold text-white hover:bg-x-accent/90"
            disabled={isSaving}
            onClick={handleSave}
            type="button"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
