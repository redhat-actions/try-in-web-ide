import * as core from "@actions/core";

export async function run(): Promise<void> {
    core.info("Here we go!");
}

run().catch(core.setFailed);
