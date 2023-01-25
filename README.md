# Try in Web IDE

[![CI Checks](https://github.com/redhat-actions/try-in-web-ide/actions/workflows/ci.yml/badge.svg)](https://github.com/redhat-actions/try-in-web-ide/actions/workflows/ci.yml)
[![Contribute](https://www.eclipse.org/che/contribute.svg)](https://workspaces.openshift.com#https://github.com/redhat-actions/try-in-web-ide)

GitHub action will add a comment and/or status check with a link to open the project on an online web IDE instance.

#### Adding a link in PR status check:
![Status check screenshot](images/status_check.png)

#### Adding a link in PR comment:
![Comment screenshot](images/comment.png)

# Usage
```yaml
# Add Web IDE link on PRs
name: web-ide

on:
  pull_request_target:
    types: [opened, synchronize]

jobs:
  add-link:
    runs-on: ubuntu-20.04
    steps:
      - name: Web IDE Pull Request Check
        id: try-in-web-ide
        uses: redhat-actions/try-in-web-ide@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Action Inputs

| Input Name | Description | Default |
| ---------- | ----------- | ------- |
| github_token | GitHub token used to add PR comment and/or status check. | **Must be provided**
| add_comment | If `true`, the action will add comments on each PR with a link to try the PR in Web IDE. | `true`
| add_status | If `true`, the action will add a PR status check on each PR with a link to try the PR in Web IDE. | `true`
| setup_remotes | If `true`, the badge and status check URL created by the action will have Git remotes automatically configured if the PR branch is located in a fork repo. The fork repo and the base repo will be configured to be the `origin` and `upstream` remote respectively. The Web IDE must be based on Eclipse Che® 7.60 for this feature. | `false`
| web_ide_instance | The base url for the Web IDE instance. | `https://workspaces.openshift.com`
| comment_badge | The badge url for the comment created when `add_comment` is `true`. | `https://img.shields.io/badge/Eclipse_Che-Hosted%20by%20Red%20Hat-525C86?logo=eclipse-che&labelColor=FDB940`

# Scenarios
- [Disable comment on pull requests](#add-comment-on-pull-requests)
- [Disable status check on pull requests](#disable-status-check-on-pull-requests)
- [Customize the link to online Web IDE instance](#customize-the-link-to-online-web-ide-instance)

## Add comment on pull requests

```yaml
- name: Web IDE Pull Request Check
  id: try-in-web-ide
  uses: redhat-actions/try-in-web-ide@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    add_comment: false
```

## Disable status check on pull requests

```yaml
- name: Web IDE Pull Request Check
  id: try-in-web-ide
  uses: redhat-actions/try-in-web-ide@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    add_status: false
```

## Customize the link to online Web IDE instance

```yaml
- name: Web IDE Pull Request Check
  id: try-in-web-ide
  uses: redhat-actions/try-in-web-ide@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    web_ide_instance: https://my-online-ide-instance.com
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