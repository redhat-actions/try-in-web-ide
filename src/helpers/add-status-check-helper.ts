import { setFailed } from "@actions/core";
import { inject, injectable } from "inversify";
import { Octokit } from "@octokit/rest";
import { WebhookPayloadPullRequest } from "@octokit/webhooks";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

@injectable()
export class AddStatusCheckHelper {
    @inject(Octokit)
    private readonly octokit: Octokit;

    public async addStatusCheck(
        description: string,
        context: string,
        targetUrl: string,
        payload: WebhookPayloadPullRequest
    ): Promise<void> {
        const statusParams: RestEndpointMethodTypes["repos"]["createStatus"]["parameters"] = {
            repo: payload.repository.name,
            owner: payload.repository.owner.login,
            sha: payload.pull_request.head.sha,
            state: "success",
            description,
            context,
            target_url: targetUrl,
        };

        this.octokit.repos.createStatus(statusParams).catch(setFailed);
    }
}
