import { inject, injectable, postConstruct } from "inversify";
import { URL } from "url";
import { WebhookPayloadPullRequest } from "@octokit/webhooks";
import { AddCommentHelper } from "../helpers/add-comment-helper";
import { AddStatusCheckHelper } from "../helpers/add-status-check-helper";
import { Configuration } from "../api/configuration";
import { Logic } from "../api/logic";
import { PullRequestAction } from "../actions/pull-request-action";

@injectable()
export class HandlePullRequestLogic implements Logic {
    public static readonly PR_EVENTS: string[] = [ "opened", "synchronize" ];

    @inject(Configuration)
    private readonly configuration: Configuration;

    @inject(PullRequestAction)
    private readonly pullRequestAction: PullRequestAction;

    @inject(AddCommentHelper)
    private readonly addCommentHelper: AddCommentHelper;

    @inject(AddStatusCheckHelper)
    private readonly addStatusCheckHelper: AddStatusCheckHelper;

    // Add the given milestone
    @postConstruct()
    public setup(): void {
        const callback = async (
            payload: WebhookPayloadPullRequest
        ): Promise<void> => {
            const prBranchName = payload.pull_request.head.ref;
            const repoUrl = payload.pull_request.head.repo.html_url;
            const targetUrl = `${this.configuration.webIdeInstance()}#${repoUrl}/tree/${prBranchName}`;
            const badgeUrl = this.configuration.commentBadge();

            if (this.configuration.addComment()) {
                await this.handleComment(payload, targetUrl, badgeUrl);
            }
            if (this.configuration.addStatus()) {
                await this.handleStatus(payload, targetUrl);
            }
        };

        this.pullRequestAction.registerCallback(
            HandlePullRequestLogic.PR_EVENTS,
            callback
        );
    }

    protected async handleComment(
        payload: WebhookPayloadPullRequest,
        targetUrl: string,
        badgeUrl: string,
    ): Promise<void> {
        const comment = `Click here to try in Web IDE: [![Contribute](${badgeUrl})](${targetUrl})`;
        await this.addCommentHelper.addComment(comment, payload);
    }

    protected async handleStatus(
        payload: WebhookPayloadPullRequest,
        targetUrl: string
    ): Promise<void> {
        const hostname = new URL(targetUrl).hostname;
        await this.addStatusCheckHelper.addStatusCheck(
            "Open in Web IDE",
            hostname,
            targetUrl,
            payload
        );
    }
}
