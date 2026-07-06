import { inject, injectable } from "inversify";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { PullRequestPayload } from "../types/pull-request-payload";
import { OctokitToken, type OctokitInstance } from "../github/octokit-builder";

@injectable()
export class AddStatusCheckHelper {
    @inject(OctokitToken)
    private readonly octokit: OctokitInstance;

    public async addStatusCheck(
        description: string,
        context: string,
        targetUrl: string,
        payload: PullRequestPayload
    ): Promise<void> {
        const statusParams: RestEndpointMethodTypes["repos"]["createCommitStatus"]["parameters"] = {
            repo: payload.repository.name,
            owner: payload.repository.owner.login,
            sha: payload.pull_request.head.sha,
            state: "success",
            description,
            context,
            target_url: targetUrl,
        };

        await this.octokit.rest.repos.createCommitStatus(statusParams);
    }
}
