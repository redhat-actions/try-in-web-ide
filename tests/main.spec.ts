/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

import * as core from "@actions/core";

import { Main } from "../src/main";
import { Inputs } from "../src/generated/inputs-outputs";

jest.mock("@actions/core");

describe("Test Main", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test("test missing github token", async () => {
        const main = new Main();
        await expect(main.start()).rejects.toThrow(
            "No GitHub Token provided (github_token)"
        );
        expect(core.setFailed).toBeCalledTimes(0);
    });

    test("test with token and no options", async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (core as any).__setInput(Inputs.GITHUB_TOKEN, "foo");

        jest.mock("../src/inversify-binding");
        const main = new Main();
        await main.start();
        expect(core.setFailed).toBeCalledTimes(0);
    });

    test("test with token and all options", async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (core as any).__setInput(Inputs.GITHUB_TOKEN, "foo");
        (core as any).__setInput(Inputs.ADD_STATUS, "true");
        (core as any).__setInput(Inputs.ADD_COMMENT, "true");
        (core as any).__setInput(Inputs.WEB_IDE_INSTANCE, "https://foo.com");

        jest.mock("../src/inversify-binding");
        const main = new Main();
        await main.start();
        expect(core.setFailed).toBeCalledTimes(0);
    });
});
