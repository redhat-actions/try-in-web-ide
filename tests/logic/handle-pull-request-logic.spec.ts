/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

import * as fs from "fs-extra";
import * as path from "path";

import { Container } from "inversify";
import { WebhookPayloadPullRequest } from "@octokit/webhooks";
import { AddCommentHelper } from "../../src/helpers/add-comment-helper";
import { AddStatusCheckHelper } from "../../src/helpers/add-status-check-helper";
import { Configuration } from "../../src/api/configuration";
import { HandlePullRequestLogic } from "../../src/logic/handle-pull-request-logic";
import { PullRequestAction } from "../../src/actions/pull-request-action";

describe("Test Logic HandlePullRequestLogic", () => {
    let container: Container;
    let configuration: Configuration;
    let pullRequestAction: PullRequestAction;
    let addCommentHelper: AddCommentHelper;
    let addStatusCheckHelper: AddStatusCheckHelper;

    beforeEach(() => {
        container = new Container();
        container.bind(HandlePullRequestLogic).toSelf().inSingletonScope();

        pullRequestAction = {
            registerCallback: jest.fn(),
        } as any;
        container.bind(PullRequestAction).toConstantValue(pullRequestAction);

        configuration = {
            addComment: jest.fn(),

            addStatus: jest.fn(),

            webIdeInstance: jest.fn(),

            commentBadge: jest.fn(),
        };
        container.bind(Configuration).toConstantValue(configuration);

        addCommentHelper = {
            addComment: jest.fn(),
        } as any;
        container.bind(AddCommentHelper).toConstantValue(addCommentHelper);

        addStatusCheckHelper = {
            addStatusCheck: jest.fn(),
        } as any;
        container
            .bind(AddStatusCheckHelper)
            .toConstantValue(addStatusCheckHelper);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("test no comment, no status", async () => {
        const handlePullRequestLogic = container.get(HandlePullRequestLogic);

        handlePullRequestLogic.setup();

        // check
        expect(pullRequestAction.registerCallback).toBeCalled();
        const registerCallbackCall = (pullRequestAction as any).registerCallback
            .mock.calls[0];

        expect(registerCallbackCall[0]).toEqual(
            HandlePullRequestLogic.PR_EVENTS
        );
        const callback = registerCallbackCall[1];

        const payload: WebhookPayloadPullRequest = await fs.readJSON(
            path.join(
                __dirname,
                "..",
                "_data",
                "pull_request",
                "opened",
                "create-pr.json"
            )
        );

        // call the callback
        await callback(payload);

        expect(addCommentHelper.addComment).toBeCalledTimes(0);
        expect(addStatusCheckHelper.addStatusCheck).toBeCalledTimes(0);
    });

    test("test comment, no status", async () => {
        const handlePullRequestLogic = container.get(HandlePullRequestLogic);

        handlePullRequestLogic.setup();

        // addComment = true
        (configuration.addComment as jest.Mock).mockReturnValue("true");

        // check
        expect(pullRequestAction.registerCallback).toBeCalled();
        const registerCallbackCall = (pullRequestAction as any).registerCallback
            .mock.calls[0];

        expect(registerCallbackCall[0]).toEqual(
            HandlePullRequestLogic.PR_EVENTS
        );
        const callback = registerCallbackCall[1];

        const payload: WebhookPayloadPullRequest = await fs.readJSON(
            path.join(
                __dirname,
                "..",
                "_data",
                "pull_request",
                "opened",
                "create-pr.json"
            )
        );

        // call the callback
        await callback(payload);

        expect(addCommentHelper.addComment).toBeCalled();
        const addCommentCall = (addCommentHelper.addComment as jest.Mock).mock
            .calls[0];
        expect(addCommentCall[0]).toMatch("Try in Web IDE");
        expect(addCommentCall[1]).toBe(payload);

        expect(addStatusCheckHelper.addStatusCheck).toBeCalledTimes(0);
    });

    test("test no comment, status", async () => {
        const handlePullRequestLogic = container.get(HandlePullRequestLogic);

        handlePullRequestLogic.setup();

        // addStatus = true
        (configuration.addStatus as jest.Mock).mockReturnValue("true");
        (configuration.webIdeInstance as jest.Mock).mockReturnValue(
            "https://foo.com"
        );

        // check
        expect(pullRequestAction.registerCallback).toBeCalled();
        const registerCallbackCall = (pullRequestAction as any).registerCallback
            .mock.calls[0];

        expect(registerCallbackCall[0]).toEqual(
            HandlePullRequestLogic.PR_EVENTS
        );
        const callback = registerCallbackCall[1];

        const payload: WebhookPayloadPullRequest = await fs.readJSON(
            path.join(
                __dirname,
                "..",
                "_data",
                "pull_request",
                "opened",
                "create-pr.json"
            )
        );

        // call the callback
        await callback(payload);

        expect(addCommentHelper.addComment).toBeCalledTimes(0);
        expect(addStatusCheckHelper.addStatusCheck).toBeCalled();
        const addStatusCall = (addStatusCheckHelper.addStatusCheck as jest.Mock)
            .mock.calls[0];
        expect(addStatusCall[0]).toMatch("Open Web IDE");
        expect(addStatusCall[1]).toMatch("foo.com");
        expect(addStatusCall[2]).toMatch(
            "https://foo.com#https://github.com/chetrend/demo-gh-event/tree/patch-2"
        );
        expect(addStatusCall[3]).toBe(payload);
    });
});
