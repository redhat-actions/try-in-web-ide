# try-in-web-ide Changelog

## v2.0.0

### Breaking Changes
- **Node 24 runtime** — action now runs on `node24` (previously `node16`/`node20`)

### Dependencies
- Upgraded TypeScript 5.8 → 6.0.3
- Upgraded ESLint 8 (EOL) → 10 with flat config migration
- Upgraded Jest 29 → 30
- Upgraded `@types/node` ^20 → ^26, `fs-extra` ^10 → ^11
- Fixed high-severity `brace-expansion` DoS vulnerability ([GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg))

### CI & Security
- Hardened all workflows with least-privilege `permissions` blocks
- Upgraded runners to `ubuntu-24.04`
- Upgraded `actions/checkout` to v7, `actions/setup-node` to v7
- Replaced archived `markdown-link-check` with [`lychee-action`](https://github.com/lycheeverse/lychee-action)
- Added concurrency groups to cancel redundant runs
- Added Dependabot version updates for npm and GitHub Actions
- Enabled secret scanning and push protection
- Set default workflow permissions to read-only
- Added `SECURITY.md`

### Docs
- Added `devfile.yaml`, VS Code extensions config, and `CONTRIBUTING.md` ([#39](https://github.com/redhat-actions/try-in-web-ide/pull/39))
- Fixed outdated references in `CONTRIBUTING.md`

## v1.4.2
- [Try to update earliest matching comment](https://github.com/redhat-actions/try-in-web-ide/pull/37)

## v1.4.1
- [Allow detecting and updating existing badge comments made by bots other than the github-actions bot](https://github.com/redhat-actions/try-in-web-ide/pull/29)

## v1.4
- [Update the existing comment instead of adding a new one](https://github.com/redhat-actions/try-in-web-ide/issues/13)

## v1.3
- Introduce new action input `setup_remotes`

## v1.2
- Update action to run on Node16. https://github.blog/changelog/2022-05-20-actions-can-now-run-in-a-node-js-16-runtime/

## v1.1
- Update pull request comment and status check text
- Listen for `pull_request_target` events instead of `pull_request` events to support pull requests from forks

## v1
- Initial Release
