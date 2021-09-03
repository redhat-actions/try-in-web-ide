# Try in Web IDE

[![CI Checks](https://github.com/redhat-actions/try-in-web-ide/actions/workflows/ci.yml/badge.svg)](https://github.com/redhat-actions/try-in-web-ide/actions/workflows/ci.yml)
[![Contribute](https://www.eclipse.org/che/contribute.svg)](https://workspaces.openshift.com#https://github.com/redhat-actions/try-in-web-ide)

GitHub action will add a comment and/or status check with a link to open the project on an online web IDE instance.

#### Adding a link in PR check:

#### Commenting on Pull Request:

# Usage
```yaml
# Add Web IDE link on PRs
name: web-ide

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  add-link:
    runs-on: ubuntu-latest
    steps:
      - name: Web IDE Pull Request Check
        id: try-in-web-ide
        uses: redhat-actions/try-in-web-ide@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

# Scenarios
- [Add comment on pull requests](#add-comment-on-pull-requests)
- [Disable status check on pull requests](#disable-status-check-on-pull-requests)
- [Customize the link to online Web IDE instance](#customize-the-link-to-online-web-ide-instance)

## Add comment on pull requests

```yaml
- name: Web IDE Pull Request Check
  id: try-in-web-ide
  uses: redhat-actions/try-in-web-ide@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    add-comment: true
```

## Disable status check on pull requests

```yaml
- name: Web IDE Pull Request Check
  id: try-in-web-ide
  uses: redhat-actions/try-in-web-ide@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    add-status: false
```

## Customize the link to online Web IDE instance

```yaml
- name: Web IDE Pull Request Check
  id: try-in-web-ide
  uses: redhat-actions/try-in-web-ide@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    che-instance: https://my-online-ide-instance.com
```

# Contributing
## Running the linter
```
npm run lint
```
## Generating `dist/index.js`
```
npm run bundle
```
## Updating the GitHub action's input and output
After updating `action.yml`, run:
```
npx action-io-generator -o src/generated/inputs-outputs.ts
```
## Running tests
```
npm run test
```