import { inject, injectable } from "inversify";
import { Octokit } from "@octokit/rest";
import { WebhookPayloadPullRequest } from "@octokit/webhooks";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { setFailed } from "@actions/core";
import { IssuesListCommentsResponseData } from "@octokit/types";

type ArrayType<T> = T extends (infer Item)[] ? Item : T;

@injectable()
export class UpdateCommentHelper {
    @inject(Octokit)
    private readonly octokit: Octokit;

    private static readonly BOT_TYPE =
        "Bot";

    /**
     * Updates a GH comment previously created by the github-actions bot with a new comment
     *
     * @param searchRegex regex used to determine which comment to edit
     * @param comment the new comment content
     * @param payload the pull request payload
     * @returns true if a previous comment was updated or if an update is not required. Otherwise returns false.
     */
    public async updateComment(
        searchRegex: RegExp,
        newComment: string,
        payload: WebhookPayloadPullRequest
    ): Promise<boolean> {
        try {
            const comments = await this.listComments(payload);
            const comment = this.findComment(comments, searchRegex);

            if (!comment) {
                return false;
            }

            if (comment.body === newComment) {
                // no need to update since new comment is same as existing comment
                // return true since updating effectively does nothing
                return true;
            }

            const result = await this.updateCommentById(
                comment.id,
                newComment,
                payload
            );
            return result.status === 200;
        }
        catch (e) {
            if (e instanceof Error || typeof e === "string") {
                setFailed(e);
            }
        }
        return false;
    }

    private async listComments(
        payload: WebhookPayloadPullRequest
    ): Promise<RestEndpointMethodTypes["issues"]["listComments"]["response"]> {
        const listCommentParams: RestEndpointMethodTypes["issues"]["listComments"]["parameters"] = {
            issue_number: payload.pull_request.number,
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
        };
        return this.octokit.issues.listComments(listCommentParams);
    }

    private findComment(
        response: RestEndpointMethodTypes["issues"]["listComments"]["response"],
        searchRegex: RegExp
    ): ArrayType<IssuesListCommentsResponseData> | undefined {
        return response.data.find((comment) => {
            return (
                comment.user.type === UpdateCommentHelper.BOT_TYPE
                    && searchRegex.test(comment.body)
            );
        });
    }

    private async updateCommentById(
        commentId: number,
        comment: string,
        payload: WebhookPayloadPullRequest
    ): Promise<RestEndpointMethodTypes["issues"]["updateComment"]["response"]> {
        const updateCommentParams: RestEndpointMethodTypes["issues"]["updateComment"]["parameters"] = {
            comment_id: commentId,
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            body: comment,
        };
        return this.octokit.issues.updateComment(updateCommentParams);
    }
}
