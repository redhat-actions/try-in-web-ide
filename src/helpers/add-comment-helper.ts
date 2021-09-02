import { inject, injectable } from "inversify";
import { Octokit } from "@octokit/rest";
import { WebhookPayloadPullRequest } from "@octokit/webhooks";
import { setFailed } from "@actions/core";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

@injectable()
export class AddCommentHelper {
    @inject(Octokit)
    private readonly octokit: Octokit;

    public async addComment(
        comment: string,
        payload: WebhookPayloadPullRequest
    ): Promise<void> {
        const createCommentParams: RestEndpointMethodTypes["issues"]["createComment"]["parameters"] = {
            body: comment,
            issue_number: payload.pull_request.number,
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
        };
        this.octokit.issues.createComment(createCommentParams).catch(setFailed);
    }
}
