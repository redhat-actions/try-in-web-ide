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
                    type: "Bot",
                },
                body: "Hello world!",
            },
        ]);
        container.bind(Octokit).toConstantValue(octokit);
        const updateCommentHelper = container.get(UpdateCommentHelper);
        await updateCommentHelper.updateComment(
            /^(Hello world)*.$/,
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
                    type: "Bot",
                },
                body: "Hello world!",
            },
            {
                id: 1235,
                user: {
                    type: "Bot",
                },
                body: "Test comment",
            },
        ]);
        container.bind(Octokit).toConstantValue(octokit);
        const updateCommentHelper = container.get(UpdateCommentHelper);

        // regex does not match comment body
        await expect(
            updateCommentHelper.updateComment(
                /^(regex does not match).*$/,
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
                    type: "Bot",
                },
                body: "Hello world!",
            },
        ]);
        container.bind(Octokit).toConstantValue(octokit);
        const updateCommentHelper = container.get(UpdateCommentHelper);

        await expect(
            updateCommentHelper.updateComment(
                /^(Hello world)*.$/,
                "Hello world!", // same comment content
                payload
            )
        ).resolves.toBe(true);

        expect(octokit.issues.updateComment).toBeCalledTimes(0);
    });

    test("update the earliest matching comment", async () => {
        const octokit = setComments([
            {
                id: 1234,
                user: {
                    type: "User",
                },
                created_at: "2022-05-09T19:54:41Z",
                body: "Hello world!",
            },
            {
                id: 1235,
                user: {
                    type: "Bot",
                },
                created_at: "2022-05-09T19:54:41Z",
                body: "Hello world!",
            },
            {
                id: 1236,
                user: {
                    type: "Organization",
                },
                created_at: "2022-06-09T19:54:41Z",
                body: "Hello world!",
            },
        ]);
        container.bind(Octokit).toConstantValue(octokit);
        const updateCommentHelper = container.get(UpdateCommentHelper);

        await expect(
            updateCommentHelper.updateComment(
                /^(Hello world)*.$/,
                "Hello world!!!!!", // different comment content
                payload
            )
        ).resolves.toBe(true);

        expect(octokit.issues.updateComment).toBeCalledWith({
            comment_id: 1234,
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            body: "Hello world!!!!!",
        });
    });

    test("update the earliset matching comment 2", async () => {
        const octokit = setComments([
            {
                id: 1234,
                user: {
                    type: "User",
                },
                created_at: "2023-05-09T19:54:41Z",
                body: "Hello world!",
            },
            {
                id: 1235,
                user: {
                    type: "Organization",
                },
                created_at: "2023-04-09T19:54:41Z",
                body: "Hello world!",
            },
        ]);
        container.bind(Octokit).toConstantValue(octokit);
        const updateCommentHelper = container.get(UpdateCommentHelper);

        await expect(
            updateCommentHelper.updateComment(
                /^(Hello world)*.$/,
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

    test("update the earliset matching comment 3", async () => {
        const octokit = setComments([
            {
                id: 1234,
                user: {
                    type: "User",
                },
                created_at: "2023-05-09T19:54:41Z",
                body: "Hello world!",
            },
            {
                id: 1235,
                user: {
                    type: "Organization",
                },
                created_at: "2023-04-09T19:54:41Z",
                body: "A different comment",
            },
        ]);
        container.bind(Octokit).toConstantValue(octokit);
        const updateCommentHelper = container.get(UpdateCommentHelper);

        await expect(
            updateCommentHelper.updateComment(
                /^(Hello world)*.$/,
                "Hello world!!!!!", // different comment content
                payload
            )
        ).resolves.toBe(true);

        expect(octokit.issues.updateComment).toBeCalledWith({
            comment_id: 1234,
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
                /^(Hello world)*.$/,
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
