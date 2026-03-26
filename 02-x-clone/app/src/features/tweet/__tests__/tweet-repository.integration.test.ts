import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import type { Database } from "../../../lib/supabase-types";
import { createTweet, listLatestTweets } from "../tweet-repository";

describe("Caso de uso: Repositorio de tweets con Supabase (mocked)", () => {
  it("DEBE mapear tweets y autor cuando carga el feed", async () => {
    const limitMock = vi.fn().mockResolvedValue({
      data: [
        {
          id: "tweet-1",
          author_id: "user-1",
          body: "hola",
          parent_tweet_id: null,
          root_tweet_id: "tweet-1",
          created_at: "2026-01-01T00:00:00Z",
          profiles: { user_id: "user-1", username: "alice", display_name: "Alice" },
        },
      ],
      error: null,
    });
    const orderMock = vi.fn().mockReturnValue({ limit: limitMock });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });
    const client = { from: fromMock } as unknown as SupabaseClient<Database>;

    const tweets = await listLatestTweets(client);

    expect(fromMock).toHaveBeenCalledWith("tweets");
    expect(tweets).toEqual([
      {
        id: "tweet-1",
        authorId: "user-1",
        authorUsername: "alice",
        authorDisplayName: "Alice",
        body: "hola",
        parentTweetId: null,
        rootTweetId: "tweet-1",
        createdAt: "2026-01-01T00:00:00Z",
      },
    ]);
  });

  it("NO DEBE ocultar errores de Supabase al crear tweet", async () => {
    const singleMock = vi.fn().mockResolvedValue({
      data: null,
      error: new Error("RLS blocked insert"),
    });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });
    const fromMock = vi.fn().mockReturnValue({ insert: insertMock });
    const client = { from: fromMock } as unknown as SupabaseClient<Database>;

    await expect(
      createTweet(
        {
          authorId: "user-1",
          body: "  hola  ",
        },
        client,
      ),
    ).rejects.toThrow("RLS blocked insert");

    expect(insertMock).toHaveBeenCalledWith({
      author_id: "user-1",
      body: "hola",
      parent_tweet_id: null,
    });
  });
});
