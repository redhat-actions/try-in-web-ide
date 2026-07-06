import { inject, injectable, named } from "inversify";
import { PullRequestPayload } from "../types/pull-request-payload";
import { Handler } from "../api/handler";
import { MultiInjectProvider } from "../api/multi-inject-provider";
import { PullRequestListener } from "../api/pull-request-listener";

@injectable()
export class PullRequestHandler implements Handler {
    @inject(MultiInjectProvider)
    @named(PullRequestListener)
    protected readonly pullRequestListeners: MultiInjectProvider<PullRequestListener>;

    supports(eventName: string): boolean {
        return eventName === "pull_request_target";
    }

    async handle(
        _eventName: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        webhookPayLoad: Record<string, any>
    ): Promise<void> {
        //

        // cast payload
        const prPayLoad = webhookPayLoad as PullRequestPayload;

        await Promise.all(
            this.pullRequestListeners
                .getAll()
                .map(async (listener) => listener.execute(prPayLoad))
        );
    }
}
