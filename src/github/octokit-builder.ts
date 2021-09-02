import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import { injectable } from "inversify";

@injectable()
export class OctokitBuilder {
    build(token: string): InstanceType<typeof GitHub> {
        return github.getOctokit(token);
    }
}
