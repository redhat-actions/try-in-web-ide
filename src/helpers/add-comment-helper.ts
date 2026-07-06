import { inject, injectable } from "inversify";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { PullRequestPayload } from "../types/pull-request-payload";
import { OctokitToken, type OctokitInstance } from "../github/octokit-builder";

@injectable()
export class AddCommentHelper {
    @inject(OctokitToken)
    private readonly octokit: OctokitInstance;

    public async addComment(
        comment: string,
        payload: PullRequestPayload
    ): Promise<void> {
        const createCommentParams: RestEndpointMethodTypes["issues"]["createComment"]["parameters"] = {
            body: comment,
            issue_number: payload.pull_request.number,
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
        };
        await this.octokit.rest.issues.createComment(createCommentParams);
    }
}
