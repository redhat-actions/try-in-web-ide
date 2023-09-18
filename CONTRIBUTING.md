# Contributing guide

## Getting started

The following devfile tasks or npm commands can be used to perform common development tasks for this project.

| **Devfile task**                          | **Npm command**                                              |
|-------------------------------------------|--------------------------------------------------------------|
| Install dependencies                      | `npm i`                                                      |
| Run linter                                | `npm run lint`                                               |
| Bundle (generate dist folder)             | `npm run bundle`                                             |
| Run tests                                 | `npm run test`                                               |
| Update GitHub action's inputs and outputs | `npx action-io-generator -o src/generated/inputs-outputs.ts` |

## Upating the GitHub action's inputs and outputs
After updating the inputs or outputs in the `try-in-web-ide/action.yml` file, run the `Update GitHub action's inputs and outputs` task to generate the corresponding Typescript definition in `src/generated`.

## Running new changes of the GitHub action within GitHub 

To run your new changes to the GitHub action,

1. Run the `Bundle (generate dist folder)` devfile task, or run the `npm run bundle` command in the terminal. 
2. Push the resulting `dist` folder to your fork:
```
git push fork your-branch
``` 
3. Create a private GitHub repository containing a file `.github/workflows/try-in-web-ide.yaml` with the following content:

```
name: try-in-web-ide

on:
  pull_request_target: 
    types: [opened, synchronize]

jobs:
  add-link:
    runs-on: ubuntu-20.04
    steps:
      - name: "Checkout source code"
        uses: actions/checkout@v3
      - name: Eclipse Che Pull Request Link
        id: che-pr-check-gh-action
        uses: <your-gh-username>/try-in-web-ide@<your-branch>
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```
Replace `<your-gh-username>` and `<your-branch>` with your username and branch name.

4. Create a PR against your private repository to run the GitHub action.

## Making a PR
Before making a PR, ensure that you have ran the `Run linter`, `Bundle`, and `Run tests` tasks successfully.
