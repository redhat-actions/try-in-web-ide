import { inject, injectable, postConstruct } from "inversify";
import { URL } from "url";
import { PullRequestPayload, PullRequestRef } from "../types/pull-request-payload";
import { AddCommentHelper } from "../helpers/add-comment-helper";
import { AddStatusCheckHelper } from "../helpers/add-status-check-helper";
import { Configuration } from "../api/configuration";
import { Logic } from "../api/logic";
import { PullRequestAction } from "../actions/pull-request-action";
import { UpdateCommentHelper } from "../helpers/update-comment-helper";

@injectable()
export class HandlePullRequestLogic implements Logic {
    public static readonly PR_EVENTS: string[] = [ "opened", "synchronize" ];

    public static readonly MESSAGE_PREFIX = "Click here to review and test in web IDE";

    @inject(Configuration)
    private readonly configuration: Configuration;

    @inject(PullRequestAction)
    private readonly pullRequestAction: PullRequestAction;

    @inject(AddCommentHelper)
    private readonly addCommentHelper: AddCommentHelper;

    @inject(AddStatusCheckHelper)
    private readonly addStatusCheckHelper: AddStatusCheckHelper;

    @inject(UpdateCommentHelper)
    private readonly updateCommentHelper: UpdateCommentHelper;

    @postConstruct()
    public setup(): void {
        const callback = async (
            payload: PullRequestPayload
        ): Promise<void> => {
            const targetUrl = this.createTargetUrl(
                payload,
                this.configuration.setupRemotes()
            );
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

    protected createTargetUrl(
        payload: PullRequestPayload,
        setupRemotes: boolean
    ): string {
        const prBranchName = payload.pull_request.head.ref;
        const repoUrl = payload.pull_request.head.repo.html_url;

        if (setupRemotes
            && !this.isSameRepo(
                payload.pull_request.base,
                payload.pull_request.head
            )
        ) {
            const baseGitUrl = payload.pull_request.base.repo.clone_url;
            return `${this.configuration.webIdeInstance()}#${repoUrl}/tree/${prBranchName}`
                + `?remotes={{upstream,${baseGitUrl}}}`;
        }

        return `${this.configuration.webIdeInstance()}#${repoUrl}/tree/${prBranchName}`;
    }

    protected isSameRepo(
        baseRepo: PullRequestRef,
        headRepo: PullRequestRef
    ): boolean {
        return baseRepo.repo.full_name === headRepo.repo.full_name;
    }

    protected async handleComment(
        payload: PullRequestPayload,
        targetUrl: string,
        badgeUrl: string
    ): Promise<void> {
        const comment = `${HandlePullRequestLogic.MESSAGE_PREFIX}: [![Contribute](${badgeUrl})](${targetUrl})`;

        const updatedExisting = await this.updateCommentHelper.updateComment(
            new RegExp(`^${HandlePullRequestLogic.MESSAGE_PREFIX}.*$`),
            comment,
            payload
        );

        if (!updatedExisting) {
            await this.addCommentHelper.addComment(comment, payload);
        }
    }

    protected async handleStatus(
        payload: PullRequestPayload,
        targetUrl: string
    ): Promise<void> {
        const hostname = new URL(targetUrl).hostname;
        await this.addStatusCheckHelper.addStatusCheck(
            HandlePullRequestLogic.MESSAGE_PREFIX,
            hostname,
            targetUrl,
            payload
        );
    }
}
