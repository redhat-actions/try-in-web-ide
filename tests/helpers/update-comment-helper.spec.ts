/* eslint-disable @typescript-eslint/no-explicit-any */

import "reflect-metadata";

import { Container } from "inversify";
import { Octokit } from "@octokit/rest";
import { WebhookPayloadPullRequest } from "@octokit/webhooks";
import { UpdateCommentHelper } from "../../src/helpers/update-comment-helper";

describe("Test Helper UpdateCommentHelper", () => {
    const payload: WebhookPayloadPullRequest = {
        pull_request: {
            number: 1,
        },
        repository: {
            owner: {
                login: "foo",
            },
            name: "bar",
        },
    } as any;

    let container: Container;

    beforeEach(() => {
        container = new Container();
        container.bind(UpdateCommentHelper).toSelf().inSingletonScope();
    });

    test("test call correct API", async () => {
        const octokit = setComments([
            {
                id: 1234,
                user: {
                    html_url: "https://github.com/apps/github-actions",
                },
                body: "Hello world!",
            },
        ]);
        container.bind(Octokit).toConstantValue(octokit);
        const updateCommentHelper = container.get(UpdateCommentHelper);
        await updateCommentHelper.updateComment(
            /^(Hello world)*./g,
            "my new comment",
            payload
        );

        expect(octokit.issues.listComments).toBeCalledWith({
            issue_number: 1,
            owner: "foo",
            repo: "bar",
        });

        expect(octokit.issues.updateComment).toBeCalledWith({
            comment_id: 1234,
            owner: "foo",
            repo: "bar",
            body: "my new comment",
        });
    });

    // test what happens when there's no regex match
    test("comment not found due to no regex match", async () => {
        const octokit = setComments([
            {
                id: 1234,
                user: {
                    html_url: "https://github.com/apps/github-actions",
                },
                body: "Hello world!",
            },
            {
                id: 1235,
                user: {
                    html_url: "https://github.com/apps/github-actions",
                },
                body: "Test comment",
            },
        ]);
        container.bind(Octokit).toConstantValue(octokit);
        const updateCommentHelper = container.get(UpdateCommentHelper);

        // regex does not match comment body
        await expect(
            updateCommentHelper.updateComment(
                /^(regex does not match).*/g,
                "my comment",
                payload
            )
        ).resolves.toBe(false);

        expect(octokit.issues.updateComment).toBeCalledTimes(0);
    });

    test("comment not found due to no comments by GH bot", async () => {
        const octokit = setComments([
            {
                id: 1234,
                user: {
                    html_url: "https://github.com/apps/other-app",
                },
                body: "Hello world!",
            },
            {
                id: 1235,
                user: {
                    html_url: "https://github.com/dkwon17-test-user",
                },
                body: "Hello world!",
            },
        ]);
        container.bind(Octokit).toConstantValue(octokit);
        const updateCommentHelper = container.get(UpdateCommentHelper);

        await expect(
            updateCommentHelper.updateComment(
                /^(Hello world)*./g,
                "my comment",
                payload
            )
        ).resolves.toBe(false);

        expect(octokit.issues.updateComment).toBeCalledTimes(0);
    });

    test("comment body is the same as new comment content", async () => {
        const octokit = setComments([
            {
                id: 1234,
                user: {
                    html_url: "https://github.com/apps/github-actions",
                },
                body: "Hello world!",
            },
        ]);
        container.bind(Octokit).toConstantValue(octokit);
        const updateCommentHelper = container.get(UpdateCommentHelper);

        await expect(
            updateCommentHelper.updateComment(
                /^(Hello world)*./g,
                "Hello world!", // same comment content
                payload
            )
        ).resolves.toBe(true);

        expect(octokit.issues.updateComment).toBeCalledTimes(0);
    });

    test("update existing comment", async () => {
        const octokit = setComments([
            {
                id: 1234,
                user: {
                    html_url: "https://github.com/dkwon17-test-user",
                },
                body: "Hello world!",
            },
            {
                id: 1235,
                user: {
                    html_url: "https://github.com/apps/github-actions",
                },
                body: "Hello world!",
            },
        ]);
        container.bind(Octokit).toConstantValue(octokit);
        const updateCommentHelper = container.get(UpdateCommentHelper);

        await expect(
            updateCommentHelper.updateComment(
                /^(Hello world)*./g,
                "Hello world!!!!!", // different comment content
                payload
            )
        ).resolves.toBe(true);

        expect(octokit.issues.updateComment).toBeCalledWith({
            comment_id: 1235,
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            body: "Hello world!!!!!",
        });
    });

    test("failed to retrieve comment", async () => {
        const octokit: any = {
            issues: {
                listComments: jest.fn((_: any) => {
                    return Promise.reject(new Error("Error!"));
                }),
                updateComment: jest.fn(),
            },
        };
        container.bind(Octokit).toConstantValue(octokit);
        const updateCommentHelper = container.get(UpdateCommentHelper);
        await expect(
            updateCommentHelper.updateComment(
                /^(Hello world)*./g,
                "Hello world!",
                payload
            )
        ).resolves.toBe(false);

        expect(octokit.issues.updateComment).toBeCalledTimes(0);
    });

    function setComments(comments: any[]): any {
        const octokit: any = {
            issues: {
                listComments: jest.fn((_: any) => {
                    return Promise.resolve({
                        data: comments,
                    });
                }),
                updateComment: jest.fn((_: any) => {
                    return Promise.resolve({ status: 200 });
                }),
            },
        };
        return octokit;
    }
});
