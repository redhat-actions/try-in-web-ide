import { WebhookPayloadPullRequest } from "@octokit/webhooks";

export const PullRequestListener = Symbol.for("PullRequestListener");
export type PullRequestListener = {
    execute(payload: WebhookPayloadPullRequest): Promise<void>;
};
