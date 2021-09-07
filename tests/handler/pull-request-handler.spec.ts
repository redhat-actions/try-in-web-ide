import "reflect-metadata";

import * as fs from "fs-extra";
import * as path from "path";

import { Container } from "inversify";
import { Handler } from "../../src/api/handler";
import { PullRequestHandler } from "../../src/handler/pull-request-handler";
import { PullRequestListener } from "../../src/api/pull-request-listener";
import { bindMultiInjectProvider } from "../../src/api/multi-inject-provider";

describe("Test PullRequestHandler", () => {
    let container: Container;

    beforeEach(() => {
        container = new Container();
        bindMultiInjectProvider(container, Handler);
        bindMultiInjectProvider(container, PullRequestListener);
        container.bind(Handler).to(PullRequestHandler).inSingletonScope();
    });

    test("test acceptance (true)", async () => {
        const prHandler: Handler = container.get(Handler);
        const supports = prHandler.supports("pull_request_target");
        expect(supports).toBeTruthy();
    });

    test("test acceptance (false)", async () => {
        const handler: Handler = container.get(Handler);
        expect(handler.constructor.name).toEqual(PullRequestHandler.name);
        const prHandler: PullRequestHandler = handler as PullRequestHandler;
        const supports = prHandler.supports("invalid-event");
        expect(supports).toBeFalsy();
    });

    test("test no listener", async () => {
        const handler: Handler = container.get(Handler);
        expect(handler.constructor.name).toEqual(PullRequestHandler.name);
        const prHandler: PullRequestHandler = handler as PullRequestHandler;
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
        prHandler.handle("pull_request", json);
        expect(prHandler["pullRequestListeners"].getAll()).toEqual([]);
    });

    test("test call one listener", async () => {
        const listener: PullRequestListener = { execute: jest.fn() };
        container.bind(PullRequestListener).toConstantValue(listener);
        const handler: Handler = container.get(Handler);
        expect(handler.constructor.name).toEqual(PullRequestHandler.name);
        const prHandler: PullRequestHandler = handler as PullRequestHandler;
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
        prHandler.handle("pull_request", json);
        expect(listener.execute).toBeCalled();
    });

    test("test call several listeners", async () => {
        // bind 2 listeners
        const listener: PullRequestListener = { execute: jest.fn() };
        container.bind(PullRequestListener).toConstantValue(listener);
        const anotherListener: PullRequestListener = { execute: jest.fn() };
        container.bind(PullRequestListener).toConstantValue(anotherListener);

        const handler: Handler = container.get(Handler);
        expect(handler.constructor.name).toEqual(PullRequestHandler.name);
        const prHandler: PullRequestHandler = handler as PullRequestHandler;
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
        prHandler.handle("issues", json);

        // two listeners
        expect(prHandler["pullRequestListeners"].getAll().length).toEqual(2);

        // each listener being invoked
        expect(listener.execute).toBeCalled();
        expect(anotherListener.execute).toBeCalled();
    });
});
