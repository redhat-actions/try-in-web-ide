/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

import * as fs from "fs-extra";
import * as path from "path";

import { Container } from "inversify";
import { WebhookPayloadPullRequest } from "@octokit/webhooks";
import { PullRequestAction } from "../../src/actions/pull-request-action";

describe("Test Action PullRequestAction", () => {
    let container: Container;

    beforeEach(() => {
        container = new Container();
        container.bind(PullRequestAction).toSelf().inSingletonScope();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("test not execute as event is unknown", async () => {
        const pullRequestAction = container.get(PullRequestAction);

        const payload: WebhookPayloadPullRequest = jest.fn() as any;

        let receivedPayload: WebhookPayloadPullRequest | undefined;

        const fooMock: any = { dummyCall: jest.fn() };
        pullRequestAction.registerCallback(
            [ "unknown-event" ],
            async (_payload: WebhookPayloadPullRequest) => {
                fooMock.dummyCall();
                receivedPayload = _payload;
            }
        );

        // duplicate callback to check we add twice the callbacks
        pullRequestAction.registerCallback(
            [ "unknown-event" ],
            async (_payload: WebhookPayloadPullRequest) => {
                fooMock.dummyCall();
                receivedPayload = _payload;
            }
        );

        await pullRequestAction.execute(payload);
        expect(fooMock.dummyCall).toBeCalledTimes(0);
        expect(receivedPayload).toBeUndefined();
    });

    // opened event should trigger action
    test("test single opened execute", async () => {
        const pullRequestAction = container.get(PullRequestAction);

        const json = await fs.readJSON(
            path.join(
                __dirname,
                "..",
                "_data",
                "pull_request",
                "opened",
                "create-pr.json"
            )
        );

        let receivedPayload: WebhookPayloadPullRequest = {} as any;
        const fooMock: any = { dummyCall: jest.fn() };
        await pullRequestAction.registerCallback(
            [ "opened" ],
            async (payload: WebhookPayloadPullRequest) => {
                fooMock.dummyCall();
                receivedPayload = payload;
            }
        );

        await pullRequestAction.execute(json);
        expect(fooMock.dummyCall).toHaveBeenCalled();
        expect(receivedPayload).toBeDefined();
        expect(receivedPayload.repository.name).toEqual("demo-gh-event");
        expect(receivedPayload.repository.owner.login).toEqual("benoitf");
        expect(receivedPayload.number).toEqual(9);
        expect(receivedPayload.sender.login).toEqual("chetrend");
    });
});
