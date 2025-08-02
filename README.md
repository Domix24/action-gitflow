# action-gitflow v0 - Release Management

Implementation of Gitflow with GitHub Actions (release/hotfix)

[![build-test](https://github.com/Domix24/action-gitflow/actions/workflows/test.yml/badge.svg)](https://github.com/Domix24/action-gitflow/actions/workflows/test.yml)
[![Check Transpiled JavaScript](https://github.com/Domix24/action-gitflow/actions/workflows/check-dist.yml/badge.svg)](https://github.com/Domix24/action-gitflow/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/Domix24/action-gitflow/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Domix24/action-gitflow/actions/workflows/codeql-analysis.yml)
[![Continuous Integration](https://github.com/Domix24/action-gitflow/actions/workflows/ci.yml/badge.svg)](https://github.com/Domix24/action-gitflow/actions/workflows/ci.yml)
[![Dependabot Auto-Merge](https://github.com/Domix24/action-gitflow/actions/workflows/auto-merge.yml/badge.svg)](https://github.com/Domix24/action-gitflow/actions/workflows/auto-merge.yml)
[![Dependabot Updates](https://github.com/Domix24/action-gitflow/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/Domix24/action-gitflow/actions/workflows/dependabot/dependabot-updates)
[![Licensed](https://github.com/Domix24/action-gitflow/actions/workflows/licensed.yml/badge.svg)](https://github.com/Domix24/action-gitflow/actions/workflows/licensed.yml)
[![Lint Codebase](https://github.com/Domix24/action-gitflow/actions/workflows/linter.yml/badge.svg)](https://github.com/Domix24/action-gitflow/actions/workflows/linter.yml)
[![Release Management](https://github.com/Domix24/action-gitflow/actions/workflows/deploy-on-close.yml/badge.svg)](https://github.com/Domix24/action-gitflow/actions/workflows/deploy-on-close.yml)
[![Update Version](https://github.com/Domix24/action-gitflow/actions/workflows/update-version.yml/badge.svg)](https://github.com/Domix24/action-gitflow/actions/workflows/update-version.yml)

## Parameters

### `dev_branch`

- _**required**_ ⚠️
- Name of the dev branch

### `main_branch`

- **required** ⚠️
- Name of the main branch

### `github_token`

- **required** ⚠️
- GitHub token
- needs to be `${{ secrets.GITHUB_TOKEN }}` ⚠️

### `release_prefix`

- default to `release/`
- prefix of the release branch

### `hotfix_prefix`

- default to `hotfix/`
- prefix of the hotfix branch

## Example file

```yaml
on:
  pull_request:
    types:
      - closed
    branches:
      - main

name: Release Management

jobs:
  release_management:
    name: Release Management
    permissions:
      contents: write
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Build
        uses: domix24/action-gitflow@v0
        with:
          dev_branch: develop
          main_branch: main
          github_token: ${{ secrets.GITHUB_TOKEN }}
```
