import { injectable } from "inversify";
import { WebhookPayloadPullRequest } from "@octokit/webhooks";
import { setFailed } from "@actions/core";
import { PullRequestListener } from "../api/pull-request-listener";

@injectable()
export class PullRequestAction implements PullRequestListener {
    private readonly pullRequestCallbacks: Map<
        string,
        Array<(payload: WebhookPayloadPullRequest) => Promise<void>>
    >;

    constructor() {
        this.pullRequestCallbacks = new Map();
    }

    /**
     * Add the callback provided by given action name
     */
    registerCallback(
        events: string[],
        callback: (payload: WebhookPayloadPullRequest) => Promise<void>
    ): void {
        events.forEach((eventName) => {
            if (!this.pullRequestCallbacks.has(eventName)) {
                this.pullRequestCallbacks.set(eventName, []);
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.pullRequestCallbacks.get(eventName)!.push(callback);
        });
    }

    async execute(payload: WebhookPayloadPullRequest): Promise<void> {
        const eventName = payload.action;

        const callbacks = this.pullRequestCallbacks.get(eventName);
        if (callbacks) {
            for await (const callback of callbacks) {
                callback(payload).catch(setFailed);
            }
        }
    }
}
