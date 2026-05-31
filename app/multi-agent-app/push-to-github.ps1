<#
push-to-github.ps1

Usage:
  1. Open PowerShell, cd into this folder (app/multi-agent-app)
  2. Run: .\push-to-github.ps1

The script will:
  - ensure git is available
  - initialize a repo if needed
  - create a commit
  - if `gh` CLI is installed, optionally create a GitHub repo and push
  - otherwise prompt for a remote URL and push

This script does NOT collect or transmit credentials; Git/gh will handle auth locally.
#>

function ExitWith($msg) {
    Write-Host $msg -ForegroundColor Red
    exit 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    ExitWith "git is not installed or not on PATH. Install git and rerun."
}

$cwd = Get-Location
Write-Host "Working in: $cwd"

if (-not (Test-Path .git)) {
    git init
    if (-not $?) { ExitWith "git init failed" }
    Write-Host "Initialized new git repository."
} else {
    Write-Host ".git already present."
}

git add .
if (-not $?) { ExitWith "git add failed" }

$commitMsg = Read-Host "Commit message (default: chore: initial commit)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) { $commitMsg = 'chore: initial commit — prepare for Vercel' }

# If there are no staged changes, skip commit
$status = git status --porcelain
    if (-not [string]::IsNullOrWhiteSpace($status)) {
        git commit -m "$commitMsg"
        if (-not $?) { ExitWith "git commit failed" }
        Write-Host "Committed changes."
    } else {
        Write-Host "No changes to commit."
    }

if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "gh CLI detected. You can create a GitHub repo now."
    $useGh = Read-Host "Create GitHub repo with gh? (y/N)"
    if ($useGh -match '^[yY]') {
        $repoName = Read-Host "Repository name (owner/repo or just repo)"
        if ([string]::IsNullOrWhiteSpace($repoName)) { ExitWith "Repo name required" }
        # if user passed only repo, create under their account
        gh repo create $repoName --source=. --remote=origin --push
        if (-not $?) { ExitWith "gh repo create failed" }
        Write-Host "Pushed to GitHub via gh"
        exit 0
    }
}

$remote = Read-Host "Enter remote Git URL (e.g. https://github.com/OWNER/REPO.git)"
if ([string]::IsNullOrWhiteSpace($remote)) { ExitWith "Remote URL required to push" }

try {
    git remote add origin $remote 2>$null
} catch {}

git branch -M main
git push -u origin main
if (-not $?) { ExitWith "git push failed. If using HTTPS, you may need to provide credentials or use a personal access token." }

Write-Host "Pushed successfully. Replace OWNER/REPO in README-VERCEL.md if needed."
