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

            setupRemotes: jest.fn(),

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

    describe("PR branch from fork remote", () => {

        const payloadPath: string = path.join(
            __dirname,
            "..",
            "_data",
            "pull_request",
            "opened",
            "create-pr.json"
        );

        test("comment false, status false, setupRemotes false", async () => {
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

            const payload: WebhookPayloadPullRequest = await fs.readJSON(payloadPath);

            // call the callback
            await callback(payload);

            expect(addCommentHelper.addComment).toBeCalledTimes(0);
            expect(addStatusCheckHelper.addStatusCheck).toBeCalledTimes(0);
        });

        test("comment true, status false, setupRemotes false", async () => {
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

            const payload: WebhookPayloadPullRequest = await fs.readJSON(payloadPath);

            // call the callback
            await callback(payload);

            expect(addCommentHelper.addComment).toBeCalled();
            const addCommentCall = (addCommentHelper.addComment as jest.Mock).mock
                .calls[0];
            expect(addCommentCall[0]).toMatch(
                "Click here to review and test in web IDE"
            );
            expect(addCommentCall[1]).toBe(payload);

            expect(addStatusCheckHelper.addStatusCheck).toBeCalledTimes(0);
        });

        test("comment false, status true, setupRemotes false", async () => {
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

            const payload: WebhookPayloadPullRequest = await fs.readJSON(payloadPath);

            // call the callback
            await callback(payload);

            expect(addCommentHelper.addComment).toBeCalledTimes(0);
            expect(addStatusCheckHelper.addStatusCheck).toBeCalled();
            const addStatusCall = (addStatusCheckHelper.addStatusCheck as jest.Mock)
                .mock.calls[0];
            expect(addStatusCall[0]).toMatch(
                "Click here to review and test in web IDE"
            );
            expect(addStatusCall[1]).toBe("foo.com");
            expect(addStatusCall[2]).toBe(
                "https://foo.com#https://github.com/chetrend/demo-gh-event/tree/patch-2"
            );
            expect(addStatusCall[3]).toBe(payload);
        });

        test("comment true, status true", async () => {
            const handlePullRequestLogic = container.get(HandlePullRequestLogic);

            handlePullRequestLogic.setup();

            // addStatus = true
            (configuration.addStatus as jest.Mock).mockReturnValue("true");
            (configuration.webIdeInstance as jest.Mock).mockReturnValue(
                "https://foo.com"
            );

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

            const payload: WebhookPayloadPullRequest = await fs.readJSON(payloadPath);

            // call the callback
            await callback(payload);

            expect(addCommentHelper.addComment).toBeCalled();
            expect(addStatusCheckHelper.addStatusCheck).toBeCalled();
            const addStatusCall = (addStatusCheckHelper.addStatusCheck as jest.Mock)
                .mock.calls[0];
            expect(addStatusCall[0]).toMatch(
                "Click here to review and test in web IDE"
            );
            expect(addStatusCall[1]).toBe("foo.com");
            expect(addStatusCall[2]).toBe(
                "https://foo.com#https://github.com/chetrend/demo-gh-event/tree/patch-2"
            );
            expect(addStatusCall[3]).toBe(payload);

            const addCommentCall = (addCommentHelper.addComment as jest.Mock).mock
                .calls[0];
            expect(addCommentCall[0]).toMatch(
                "Click here to review and test in web IDE"
            );
            expect(addCommentCall[1]).toBe(payload);
        });

        test("comment false, status true, setupRemotes true", async () => {
            const handlePullRequestLogic = container.get(HandlePullRequestLogic);

            handlePullRequestLogic.setup();

            // addStatus = true
            (configuration.addStatus as jest.Mock).mockReturnValue("true");
            // setupRemotes = true
            (configuration.setupRemotes as jest.Mock).mockReturnValue("true");
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

            const payload: WebhookPayloadPullRequest = await fs.readJSON(payloadPath);

            // call the callback
            await callback(payload);

            expect(addCommentHelper.addComment).toBeCalledTimes(0);
            expect(addStatusCheckHelper.addStatusCheck).toBeCalled();
            const addStatusCall = (addStatusCheckHelper.addStatusCheck as jest.Mock)
                .mock.calls[0];
            expect(addStatusCall[0]).toMatch(
                "Click here to review and test in web IDE"
            );
            expect(addStatusCall[1]).toBe("foo.com");

            // check that upstream remote is configured
            expect(addStatusCall[2]).toBe(
                "https://foo.com#https://github.com/chetrend/demo-gh-event/tree/patch-2?remotes={{upstream,https://github.com/benoitf/demo-gh-event.git}}"
            );
            expect(addStatusCall[3]).toBe(payload);
        });
    });

    describe("PR branch from upstream remote", () => {

        const payloadPath: string = path.join(
            __dirname,
            "..",
            "_data",
            "pull_request",
            "opened",
            "create-pr-source-head-branch-same-repo.json"
        );

        test("comment false, status true, setupRemotes false", async () => {
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

            const payload: WebhookPayloadPullRequest = await fs.readJSON(payloadPath);

            // call the callback
            await callback(payload);

            expect(addCommentHelper.addComment).toBeCalledTimes(0);
            expect(addStatusCheckHelper.addStatusCheck).toBeCalled();
            const addStatusCall = (addStatusCheckHelper.addStatusCheck as jest.Mock)
                .mock.calls[0];
            expect(addStatusCall[0]).toMatch(
                "Click here to review and test in web IDE"
            );
            expect(addStatusCall[1]).toBe("foo.com");
            expect(addStatusCall[2]).toBe(
                "https://foo.com#https://github.com/dkwon17/try-in-web-ide-testing/tree/pr-branch"
            );
            expect(addStatusCall[3]).toBe(payload);
        });

        test("comment false, status true, setupRemotes true", async () => {
            const handlePullRequestLogic = container.get(HandlePullRequestLogic);

            handlePullRequestLogic.setup();

            // addStatus = true
            (configuration.addStatus as jest.Mock).mockReturnValue("true");
            (configuration.setupRemotes as jest.Mock).mockReturnValue("true");
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

            const payload: WebhookPayloadPullRequest = await fs.readJSON(payloadPath);

            // call the callback
            await callback(payload);

            expect(addCommentHelper.addComment).toBeCalledTimes(0);
            expect(addStatusCheckHelper.addStatusCheck).toBeCalled();
            const addStatusCall = (addStatusCheckHelper.addStatusCheck as jest.Mock)
                .mock.calls[0];
            expect(addStatusCall[0]).toMatch(
                "Click here to review and test in web IDE"
            );
            expect(addStatusCall[1]).toBe("foo.com");

            // setupRemotes true results in no difference if PR branch is located in the upstream repo
            expect(addStatusCall[2]).toBe(
                "https://foo.com#https://github.com/dkwon17/try-in-web-ide-testing/tree/pr-branch"
            );
            expect(addStatusCall[3]).toBe(payload);
        });
    });
});
