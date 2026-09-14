#!/bin/sh
set -eu

mode="${1:-inspect}"
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)
repo_root=$(CDPATH= cd -- "$script_dir/.." && pwd -P)
expected_origin="https://github.com/nanowindlab/vocabulary_mindmap3.git"
expected_project_id="prj_3JRsvrzRcQ0sEtczLPqsJdt69jCj"
expected_org_id="team_ZQ8Z9U6TXluExTG3fp3AHorA"
expected_project_name="vocabulary-mindmap3"

if [ "$(pwd -P)" != "$repo_root" ]; then
  echo "BLOCKED: run this check from the vocabulary_mindmap3 repository root." >&2
  echo "Do not run Vercel from 09_app, a parent directory, or my-codex-project." >&2
  exit 2
fi

if [ "$(git rev-parse --show-toplevel)" != "$repo_root" ]; then
  echo "BLOCKED: current Git top level is not vocabulary_mindmap3." >&2
  exit 2
fi

if [ "$(git remote get-url origin)" != "$expected_origin" ]; then
  echo "BLOCKED: origin does not match nanowindlab/vocabulary_mindmap3." >&2
  exit 2
fi

if [ ! -f .vercel/project.json ]; then
  echo "BLOCKED: .vercel/project.json is missing; do not auto-link another project." >&2
  exit 2
fi

project_id=$(jq -r '.projectId // empty' .vercel/project.json)
org_id=$(jq -r '.orgId // empty' .vercel/project.json)
project_name=$(jq -r '.projectName // empty' .vercel/project.json)
if [ "$project_id" != "$expected_project_id" ] || [ "$org_id" != "$expected_org_id" ] || [ "$project_name" != "$expected_project_name" ]; then
  echo "BLOCKED: local Vercel project link does not match the documented project." >&2
  exit 2
fi

if ! jq -e '
  .installCommand == "npm ci && npm --prefix 09_app install" and
  .buildCommand == "MM3_RUNTIME_BUNDLE_BASE_URL=https://mm3-runtime-gateway.nanowind.workers.dev npm --prefix 09_app run build" and
  .outputDirectory == "09_app/dist"
' vercel.json >/dev/null; then
  echo "BLOCKED: vercel.json no longer matches the documented root build contract." >&2
  exit 2
fi

if [ "$mode" = "production" ]; then
  if [ "$(git branch --show-current)" != "main" ]; then
    echo "BLOCKED: production updates must start from main." >&2
    exit 2
  fi
  if [ -n "$(git status --porcelain)" ]; then
    echo "BLOCKED: production preflight requires a clean worktree." >&2
    exit 2
  fi
elif [ "$mode" != "inspect" ] && [ "$mode" != "preview" ]; then
  echo "Usage: sh scripts/vercel-preflight.sh [inspect|preview|production]" >&2
  exit 2
fi

echo "PASS: repository=$expected_origin"
echo "PASS: project=$expected_project_name ($expected_project_id)"
echo "PASS: root_directory=. build_output=09_app/dist"
echo "INFO: branch=$(git branch --show-current) head=$(git rev-parse HEAD)"
echo "CHECK SERVER: Git repository, Production Branch, Root Directory, and expected deployment SHA"
