import "reflect-metadata";

import * as core from "@actions/core";

jest.mock("@actions/core");

describe("Test Index", () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    test("test index", async () => {
        await require("../src/index");

        expect(core.setFailed).toHaveBeenCalled();
        const call = (core.setFailed as jest.Mock).mock.calls[0];
        expect(call[0]).toMatch("No GitHub Token provided (github_token)");
    });
});
