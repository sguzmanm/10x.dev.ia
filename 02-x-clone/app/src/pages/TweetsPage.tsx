import { useState } from "react";
import { validateTweetText } from "../features/tweet/tweet-validator";

const MOCK_TWEETS = [
  { id: "1", author: "@dev", body: "Shipping a dark-mode feed with mock data." },
  { id: "2", author: "@you", body: "TDD for the compose box — validation before post." },
];

export function TweetsPage() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handlePost() {
    const result = validateTweetText(text);
    if (!result.valid) {
      setError(result.reason ?? "Invalid tweet");
      return;
    }
    setError(null);
  }

  return (
    <div className="space-y-8">
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
          onClick={handlePost}
          type="button"
        >
          Post
        </button>
      </section>

      <section aria-label="Feed">
        <h2 className="mb-3 text-lg font-semibold">Latest</h2>
        <ul className="space-y-3">
          {MOCK_TWEETS.map((tweet) => (
            <li
              className="rounded-2xl border border-x-border bg-x-bg px-4 py-3"
              key={tweet.id}
            >
              <p className="text-sm text-x-muted">{tweet.author}</p>
              <p className="mt-1 whitespace-pre-wrap">{tweet.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
