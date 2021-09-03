import * as core from "@actions/core";
import * as github from "@actions/github";
import { Analysis } from "./analysis";
import { Inputs } from "./generated/inputs-outputs";
import { InversifyBinding } from "./inversify-binding";

export class Main {
    async start(): Promise<void> {
        // github write token
        const githubToken = core.getInput(Inputs.GITHUB_TOKEN, {
            required: true,
        });
        if (!githubToken) {
            throw new Error(
                `No GitHub Token provided (${Inputs.GITHUB_TOKEN})`
            );
        }

        const addComment = core.getInput(Inputs.ADD_COMMENT);
        const addStatus = core.getInput(Inputs.ADD_STATUS);
        const webIdeInstance = core.getInput(Inputs.WEB_IDE_INSTANCE);

        const inversifyBinbding = new InversifyBinding(
            githubToken,
            addComment === "true",
            addStatus === "true",
            webIdeInstance
        );
        const container = inversifyBinbding.initBindings();
        const analysis = container.get(Analysis);
        await analysis.analyze(github.context);
    }
}
