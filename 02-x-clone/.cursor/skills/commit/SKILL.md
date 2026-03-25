# Commit skill

When generating git commit messages for this repository, you must strictly follow this structure and base your output on the `git diff`.

**Rules:**
- **Summary:** A concise summary of the change in the imperative mood (e.g., "Add", "Fix"). Keep it under 72 characters.
- **Blank Line:** You MUST leave one empty line between the summary and the body.
- **What:** A brief explanation of the technical changes made.
- **Why:** The reasoning, context, or business value behind the change.

**Constraints**
- DO NOT add extra lines to the commit stating the author or any extra info
- DO NOT include "Made-with: Cursor" or any tool attribution lines

**Example**

```
Add Claude commit skill to repository

What: Create md file for committing into repository
Why: Allow Claude to create commit without human intervention
```