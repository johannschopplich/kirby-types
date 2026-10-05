#!/usr/bin/env bash
# Run tsc, tsd, lint, and the line check on every commit in <BASE>..HEAD, each in isolation, so a
# commit that only passes together with a later one shows up. Borrows the
# checkout's own node_modules – install the branch's dependencies first.
#
# Usage: check-commits.sh <KIRBY_TYPES_ROOT> <BASE> [LINE]
set -euo pipefail
scripts=$(cd "$(dirname "$0")" && pwd)

root=${1:?Usage: check-commits.sh <KIRBY_TYPES_ROOT> <BASE> [LINE]}
base=${2:?Usage: check-commits.sh <KIRBY_TYPES_ROOT> <BASE> [LINE]}
line=${3:-$(git -C "$root" branch --show-current)}
commits=$(git -C "$root" rev-list --reverse "$base..HEAD")
[ -n "$commits" ] || { echo "No commits in $base..HEAD."; exit 1; }
tmp=$(mktemp -d)
worktree=$tmp/kt-check-commits

git -C "$root" worktree add --quiet --detach "$worktree" "$base"
trap 'git -C "$root" worktree remove --force "$worktree"; rm -rf "$tmp"' EXIT
ln -s "$root/node_modules" "$worktree/node_modules"

status=0
for commit in $commits; do
  git -C "$worktree" checkout --quiet "$commit"
  if output=$( (cd "$worktree" && pnpm exec tsc --noEmit -p . && pnpm -s test && pnpm -s lint && node "$scripts/check-line.mjs" . "$line") 2>&1); then
    echo "OK   $(git -C "$root" log --oneline -1 "$commit")"
  else
    echo "FAIL $(git -C "$root" log --oneline -1 "$commit")"
    echo "$output" | tail -n 20
    status=1
  fi
done
exit $status
