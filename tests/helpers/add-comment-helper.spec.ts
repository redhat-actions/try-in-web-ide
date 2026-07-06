/* eslint-disable @typescript-eslint/no-explicit-any */

import "reflect-metadata";

import { Container } from "inversify";
import { PullRequestPayload } from "../../src/types/pull-request-payload";
import { OctokitToken } from "../../src/github/octokit-builder";
import { AddCommentHelper } from "../../src/helpers/add-comment-helper";

describe("Test Helper AddCommentHelper", () => {
    let container: Container;

    beforeEach(() => {
        container = new Container();
        container.bind(AddCommentHelper).toSelf().inSingletonScope();
    });

    // check with label existing
    test("test call correct API", async () => {
        const createComment = jest.fn().mockResolvedValue(null);
        const octokit: any = {
            rest: {
                issues: {
                    createComment,
                },
            },
        };

        container.bind(OctokitToken).toConstantValue(octokit);
        const addCommentHelper = container.get(AddCommentHelper);

        const payload: PullRequestPayload = {
            pull_request: {
                number: 123,
            },
            repository: {
                owner: {
                    login: "foo",
                },
                name: "bar",
            },
        } as any;

        const comment = "my-comment";
        await addCommentHelper.addComment(comment, payload);
        expect(createComment).toHaveBeenCalledWith({
            body: comment,
            owner: "foo",
            repo: "bar",
            issue_number: 123,
        });
    });
});
