#!/usr/bin/env bash
# Run tsc, tsd, lint, and the version check on every first-parent commit in
# <BASE>..HEAD, each in isolation, so a commit that only passes together with a
# later one shows up. A merge counts as one commit: the commits it brings in
# were checked on their own branch.
# Each commit is judged by the check-versions.mjs it ships, else by this script's,
# so a rule tightened later fails no commit that ships its own. Borrows the
# checkout's own node_modules – install the branch's dependencies first.
#
# Usage: check-commits.sh <KIRBY_TYPES_ROOT> <BASE>
set -euo pipefail
scripts=$(cd "$(dirname "$0")" && pwd)

root=$(cd "${1:?Usage: check-commits.sh <KIRBY_TYPES_ROOT> <BASE>}" && pwd)
base=${2:?Usage: check-commits.sh <KIRBY_TYPES_ROOT> <BASE>}
commits=$(git -C "$root" rev-list --reverse --first-parent "$base..HEAD")
[ -n "$commits" ] || { echo "No commits in $base..HEAD."; exit 1; }
tmp=$(mktemp -d)
worktree=$tmp/kt-check-commits

git -C "$root" worktree add --quiet --detach "$worktree" "$base"
trap 'git -C "$root" worktree remove --force "$worktree"; rm -rf "$tmp"' EXIT
ln -s "$root/node_modules" "$worktree/node_modules"

status=0
shipped_check_versions=.claude/skills/audit-panel-types/scripts/check-versions.mjs
for commit in $commits; do
  git -C "$worktree" checkout --quiet "$commit"
  check_versions=$worktree/$shipped_check_versions
  [ -f "$check_versions" ] || check_versions=$scripts/check-versions.mjs
  if output=$( (cd "$worktree" && pnpm exec tsc --noEmit -p . && pnpm -s test && pnpm -s lint && node "$check_versions" .) 2>&1); then
    echo "OK   $(git -C "$root" log --oneline -1 "$commit")"
  else
    echo "FAIL $(git -C "$root" log --oneline -1 "$commit")"
    echo "$output" | tail -n 20
    status=1
  fi
done
exit $status
