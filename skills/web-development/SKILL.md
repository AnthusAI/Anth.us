---
name: Web Development Options Pattern
description: A workflow for developing and reviewing multiple design options simultaneously using Git worktrees.
---

# Web Development Options Pattern

When the user requests to see multiple visual or functional options for a feature, use the following Git worktree pattern to serve them simultaneously on different ports. This allows iterative review, selective merging, and comparison before finalizing the main feature branch.

## 1. Branching Strategy

- **Main Feature Branch**: The primary branch for the current feature (e.g., `aesthetic-improvements`). This is served on the primary dev port (e.g., `8000`).
- **Option Branches**: Sub-feature branches branched off the main feature branch (e.g., `option-a`, `option-b`).

## 2. Worktree Setup

To run multiple dev servers without conflicts, isolate each option in its own Git worktree inside a `.worktrees/` directory (which should be added to `.gitignore`).

```bash
# Add worktrees directory to gitignore
echo ".worktrees/" >> .gitignore

# Create worktrees and branches for options
git worktree add .worktrees/option-a option-a
git worktree add .worktrees/option-b option-b
```

## 3. Server Configuration

Start the dev servers on distinct ports. Ensure dependencies are correctly installed for each worktree (clearing out `node_modules`, `.cache`, and `package-lock.json` if there are Node version compatibility issues).

- **Main Feature**: `npm start -- -p 8000` (in root directory)
- **Option A**: `npm start -- -p 8001` (in `.worktrees/option-a`)
- **Option B**: `npm start -- -p 8002` (in `.worktrees/option-b`)

## 4. Iteration and Merging

1. Present the options to the user on their respective ports.
2. Refine options based on user feedback.
3. Once an option (or a combination) is selected, merge or cherry-pick the successful changes from the option branches back into the **Main Feature Branch**.
4. Eventually, when the feature is complete and reviewed, merge the main feature branch into `develop` or `main` via a Pull Request.

## Troubleshooting Gatsby/Node Issues

If you encounter `ERR_BUFFER_OUT_OF_BOUNDS` or `Key size is larger than the maximum key size (1978)` during worktree setup in Gatsby:

- These are often caused by `msgpackr` / `lmdb` native binary issues on newer Node engines, combined with dirty `package-lock.json` files.
- **Fix**: Use a stable Node version (e.g., `node@18`), add `msgpackr: ^1.11.2` to `package.json` overrides, and critically: **delete `package-lock.json` and `.cache` in the worktree before running `npm install`.**
