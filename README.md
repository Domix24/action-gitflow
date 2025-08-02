# action-gitflow v0 - Release Management

<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

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
