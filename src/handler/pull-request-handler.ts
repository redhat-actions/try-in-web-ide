import { inject, injectable, named } from "inversify";
import { WebhookPayload } from "@actions/github/lib/interfaces";
import { WebhookPayloadPullRequest } from "@octokit/webhooks";
import { Handler } from "../api/handler";
import { MultiInjectProvider } from "../api/multi-inject-provider";
import { PullRequestListener } from "../api/pull-request-listener";

@injectable()
export class PullRequestHandler implements Handler {
    @inject(MultiInjectProvider)
    @named(PullRequestListener)
    protected readonly pullRequestListeners: MultiInjectProvider<PullRequestListener>;

    supports(eventName: string): boolean {
        return eventName === "pull_request";
    }

    async handle(
        _eventName: string,
        webhookPayLoad: WebhookPayload
    ): Promise<void> {
        //

        // cast payload
        const prPayLoad = webhookPayLoad as WebhookPayloadPullRequest;

        await Promise.all(
            this.pullRequestListeners
                .getAll()
                .map(async (listener) => listener.execute(prPayLoad))
        );
    }
}
