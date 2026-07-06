/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

import * as fs from "fs-extra";
import * as path from "path";

import { Container } from "inversify";
import { PullRequestPayload } from "../../src/types/pull-request-payload";
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

        const payload: PullRequestPayload = jest.fn() as any;

        let receivedPayload: PullRequestPayload | undefined;

        const fooMock: any = { dummyCall: jest.fn() };
        pullRequestAction.registerCallback(
            [ "unknown-event" ],
            async (_payload: PullRequestPayload) => {
                fooMock.dummyCall();
                receivedPayload = _payload;
            }
        );

        // duplicate callback to check we add twice the callbacks
        pullRequestAction.registerCallback(
            [ "unknown-event" ],
            async (_payload: PullRequestPayload) => {
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

        let receivedPayload: PullRequestPayload = {} as any;
        const fooMock: any = { dummyCall: jest.fn() };
        await pullRequestAction.registerCallback(
            [ "opened" ],
            async (payload: PullRequestPayload) => {
                fooMock.dummyCall();
                receivedPayload = payload;
            }
        );

        await pullRequestAction.execute(json);
        expect(fooMock.dummyCall).toHaveBeenCalled();
        expect(receivedPayload).toBeDefined();
        expect(receivedPayload.repository.name).toEqual("demo-gh-event");
        expect(receivedPayload.repository.owner.login).toEqual("benoitf");
        expect((receivedPayload as any).number).toEqual(9);
        expect((receivedPayload as any).sender.login).toEqual("chetrend");
    });
});
