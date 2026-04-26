## GitHub Issue & Pull Request Operations

Always use the `gh` CLI to interact with GitHub issues and pull requests instead of navigating to GitHub URLs in a browser.

Preferred commands:

- `gh issue view <number>` — fetch issue details
- `gh issue edit <number> --title "..." --body "..."` — update an issue
- `gh issue create --title "..." --body "..."` — create an issue
- `gh issue list` — list issues
- `gh issue close <number>` — close an issue
- `gh pr view [<number>]` — fetch PR details
- `gh pr edit <number> --title "..." --body "..."` — update a PR
- `gh pr create` — create a PR
- `gh pr list` — list PRs

Never open a browser page to a GitHub issue or pull request URL to read or edit it.

## Filling Out Issue Templates

When a user asks to file a GitHub issue, always read the relevant template first:

```bash
cat .github/ISSUE_TEMPLATE/feature_request.md   # for feature requests
cat .github/ISSUE_TEMPLATE/bug_report.md         # for bug reports
```

Fill every section of the template. Use `gh issue create --body "..."` to post the completed issue.

### Screenshots and images from chat context

Screenshots attached to the chat cannot be uploaded programmatically via `gh`. When an issue body should include a screenshot:

1. Insert a clearly labelled placeholder: `> _[Attach screenshot manually: <description of what the screenshot shows>]_`
2. Note this to the user after creating the issue so they can edit it on GitHub and drag-drop the image.
