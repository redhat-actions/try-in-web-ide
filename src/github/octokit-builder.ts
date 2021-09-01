import * as github from "@actions/github";
import { Octokit } from "@octokit/rest";
import { injectable } from "inversify";

@injectable()
export class OctokitBuilder {
    build(token: string): Octokit {
        return new github.GitHub(token);
    }
}
