import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import { injectable } from "inversify";

export const OctokitToken = Symbol.for("Octokit");
export type OctokitInstance = InstanceType<typeof GitHub>;

@injectable()
export class OctokitBuilder {
    build(token: string): OctokitInstance {
        return github.getOctokit(token);
    }
}
