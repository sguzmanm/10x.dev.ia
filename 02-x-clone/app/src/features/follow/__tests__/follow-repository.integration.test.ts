import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import type { Database } from "../../../lib/supabase-types";
import { followUser, listFollowingIds, unfollowUser } from "../follow-repository";

describe("Caso de uso: Repositorio de follows con Supabase (mocked)", () => {
  it("DEBE retornar IDs que el usuario sigue", async () => {
    const eqMock = vi.fn().mockResolvedValue({
      data: [{ followee_id: "user-2" }, { followee_id: "user-3" }],
      error: null,
    });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });
    const client = { from: fromMock } as unknown as SupabaseClient<Database>;

    const followingIds = await listFollowingIds("user-1", client);

    expect(followingIds).toEqual(["user-2", "user-3"]);
  });

  it("NO DEBE ocultar errores de follow/unfollow", async () => {
    const deleteEqStepTwo = vi.fn().mockResolvedValue({
      error: new Error("delete blocked"),
    });
    const deleteEqStepOne = vi.fn().mockReturnValue({ eq: deleteEqStepTwo });
    const deleteMock = vi.fn().mockReturnValue({ eq: deleteEqStepOne });
    const insertMock = vi.fn().mockResolvedValue({ error: new Error("insert blocked") });
    const fromMock = vi
      .fn()
      .mockReturnValueOnce({ insert: insertMock })
      .mockReturnValueOnce({ delete: deleteMock });

    const client = { from: fromMock } as unknown as SupabaseClient<Database>;

    await expect(followUser("user-1", "user-2", client)).rejects.toThrow("insert blocked");
    await expect(unfollowUser("user-1", "user-2", client)).rejects.toThrow("delete blocked");
  });
});
