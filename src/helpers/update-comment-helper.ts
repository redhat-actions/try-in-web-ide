import { inject, injectable } from "inversify";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { setFailed } from "@actions/core";
import { PullRequestPayload } from "../types/pull-request-payload";
import { OctokitToken, type OctokitInstance } from "../github/octokit-builder";

type CommentsResponseData = RestEndpointMethodTypes["issues"]["listComments"]["response"]["data"];
type CommentData = CommentsResponseData[number];

@injectable()
export class UpdateCommentHelper {
    @inject(OctokitToken)
    private readonly octokit: OctokitInstance;

    /**
     * Updates a GH comment with a new comment if needed
     *
     * @param searchRegex regex used to determine which comment to edit
     * @param comment the new comment content
     * @param payload the pull request payload
     * @returns true if a previous comment was updated or if an update is not required. Otherwise returns false.
     */
    public async updateComment(
        searchRegex: RegExp,
        newComment: string,
        payload: PullRequestPayload
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

            await this.updateCommentById(
                comment.id,
                newComment,
                payload
            );
            return true;
        }
        catch (e) {
            if (e instanceof Error || typeof e === "string") {
                setFailed(e);
            }
        }
        return false;
    }

    private async listComments(
        payload: PullRequestPayload
    ): Promise<RestEndpointMethodTypes["issues"]["listComments"]["response"]> {
        const listCommentParams: RestEndpointMethodTypes["issues"]["listComments"]["parameters"] = {
            issue_number: payload.pull_request.number,
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
        };
        return this.octokit.rest.issues.listComments(listCommentParams);
    }

    private findComment(
        response: RestEndpointMethodTypes["issues"]["listComments"]["response"],
        searchRegex: RegExp
    ): CommentData | undefined {
        const matches = response.data.filter((comment) => {
            return comment.body != null && searchRegex.test(comment.body);
        });
        // comments are sorted by ascending id
        return this.getEarliestComment(matches);
    }

    private getEarliestComment(
        comments: CommentsResponseData
    ): CommentData | undefined {
        if (comments.length === 0) {
            return undefined;
        }
        let earliest = comments[0];
        for (let i = 1; i < comments.length; i++) {
            if (new Date(comments[i].created_at) < new Date(earliest.created_at)) {
                earliest = comments[i];
            }
        }
        return earliest;
    }

    private async updateCommentById(
        commentId: number,
        comment: string,
        payload: PullRequestPayload
    ): Promise<RestEndpointMethodTypes["issues"]["updateComment"]["response"]> {
        const updateCommentParams: RestEndpointMethodTypes["issues"]["updateComment"]["parameters"] = {
            comment_id: commentId,
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            body: comment,
        };
        return this.octokit.rest.issues.updateComment(updateCommentParams);
    }
}
