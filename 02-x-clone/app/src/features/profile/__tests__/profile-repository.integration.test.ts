import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import type { Database } from "../../../lib/supabase-types";
import {
  getProfileByUserId,
  getProfileByUsername,
  listVisibleProfiles,
  updateDisplayName,
} from "../profile-repository";

describe("Caso de uso: Repositorio de profiles con Supabase (mocked)", () => {
  it("DEBE mapear profiles visibles", async () => {
    const orderMock = vi.fn().mockResolvedValue({
      data: [
        {
          user_id: "user-1",
          username: "alice",
          display_name: "Alice",
          bio: "hello",
          avatar_url: null,
        },
      ],
      error: null,
    });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });
    const client = { from: fromMock } as unknown as SupabaseClient<Database>;

    const profiles = await listVisibleProfiles(client);

    expect(profiles).toEqual([
      {
        userId: "user-1",
        username: "alice",
        displayName: "Alice",
        bio: "hello",
        avatarUrl: null,
      },
    ]);
  });

  it("NO DEBE fallar cuando no existe profile para el usuario", async () => {
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });
    const client = { from: fromMock } as unknown as SupabaseClient<Database>;

    const profile = await getProfileByUserId("missing-user", client);

    expect(profile).toBeNull();
  });

  it("DEBE obtener profile por username", async () => {
    const maybeSingleMock = vi.fn().mockResolvedValue({
      data: {
        user_id: "user-2",
        username: "bob",
        display_name: "Bob",
        bio: "ship it",
        avatar_url: null,
      },
      error: null,
    });
    const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });
    const client = { from: fromMock } as unknown as SupabaseClient<Database>;

    const profile = await getProfileByUsername("bob", client);

    expect(profile).toEqual({
      userId: "user-2",
      username: "bob",
      displayName: "Bob",
      bio: "ship it",
      avatarUrl: null,
    });
  });

  it("DEBE actualizar display_name de un profile", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: {
        user_id: "user-1",
        username: "alice",
        display_name: "Alice Updated",
        bio: "hello",
        avatar_url: null,
      },
      error: null,
    });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const eqMock = vi.fn().mockReturnValue({ select: selectMock });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ update: updateMock });
    const client = { from: fromMock } as unknown as SupabaseClient<Database>;

    const profile = await updateDisplayName("user-1", "Alice Updated", client);

    expect(updateMock).toHaveBeenCalledWith({ display_name: "Alice Updated" });
    expect(eqMock).toHaveBeenCalledWith("user_id", "user-1");
    expect(profile).toEqual({
      userId: "user-1",
      username: "alice",
      displayName: "Alice Updated",
      bio: "hello",
      avatarUrl: null,
    });
  });
});
