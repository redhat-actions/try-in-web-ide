/* eslint-disable @typescript-eslint/no-explicit-any */

import "reflect-metadata";

import { Container } from "inversify";
import { PullRequestPayload } from "../../src/types/pull-request-payload";
import { OctokitToken } from "../../src/github/octokit-builder";
import { AddStatusCheckHelper } from "../../src/helpers/add-status-check-helper";

describe("Test Helper AddCommentHelper", () => {
    let container: Container;

    beforeEach(() => {
        container = new Container();
        container.bind(AddStatusCheckHelper).toSelf().inSingletonScope();
    });

    // check with label existing
    test("test call correct API", async () => {
        const createCommitStatus = jest.fn().mockResolvedValue(null);
        const octokit: any = {
            rest: {
                repos: {
                    createCommitStatus,
                },
            },
        };

        container.bind(OctokitToken).toConstantValue(octokit);
        const addStatusCheckHelper = container.get(AddStatusCheckHelper);

        const payload: PullRequestPayload = {
            pull_request: {
                head: {
                    sha: 456,
                },
                number: 123,
            },
            repository: {
                owner: {
                    login: "foo",
                },
                name: "bar",
            },
        } as any;

        const description = "my-desc";
        const context = "my-context";
        const targetUrl = "https://foobar.com";

        await addStatusCheckHelper.addStatusCheck(
            description,
            context,
            targetUrl,
            payload
        );

        expect(createCommitStatus).toHaveBeenCalledWith({
            description,
            target_url: targetUrl,
            context,
            owner: "foo",
            repo: "bar",
            sha: 456,
            state: "success",
        });
    });
});
