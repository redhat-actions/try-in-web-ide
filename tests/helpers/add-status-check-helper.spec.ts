/* eslint-disable @typescript-eslint/no-explicit-any */

import "reflect-metadata";

import { Container } from "inversify";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { WebhookPayloadPullRequest } from "@octokit/webhooks";
import { AddStatusCheckHelper } from "../../src/helpers/add-status-check-helper";

describe("Test Helper AddCommentHelper", () => {
    let container: Container;

    beforeEach(() => {
        container = new Container();
        container.bind(AddStatusCheckHelper).toSelf().inSingletonScope();
    });

    // check with label existing
    test("test call correct API", async () => {
        const octokit: any = {
            repos: {
                createCommitStatus: jest.fn().mockImplementation((_: any) => {
                    return Promise.resolve(null);
                }),
            },
        };

        container.bind(Octokit).toConstantValue(octokit);
        const addStatusCheckHelper = container.get(AddStatusCheckHelper);

        const payload: WebhookPayloadPullRequest = {
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

        expect(octokit.repos.createCommitStatus).toBeCalled();

        type ReposCreateStatus = RestEndpointMethodTypes["repos"]["createStatus"]["parameters"];
        const params: ReposCreateStatus = octokit.repos.createCommitStatus.mock.calls[0][0];

        expect(params.description).toBe(description);
        expect(params.target_url).toBe(targetUrl);
        expect(params.context).toBe(context);
        expect(params.owner).toBe("foo");
        expect(params.repo).toBe("bar");
        expect(params.sha).toBe(456);
        expect(params.state).toBe("success");
    });
});
