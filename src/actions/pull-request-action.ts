import { injectable } from "inversify";
import { PullRequestPayload } from "../types/pull-request-payload";
import { PullRequestListener } from "../api/pull-request-listener";

@injectable()
export class PullRequestAction implements PullRequestListener {
    private readonly pullRequestCallbacks: Map<
        string,
        Array<(payload: PullRequestPayload) => Promise<void>>
    >;

    constructor() {
        this.pullRequestCallbacks = new Map();
    }

    /**
     * Add the callback provided by given action name
     */
    registerCallback(
        events: string[],
        callback: (payload: PullRequestPayload) => Promise<void>
    ): void {
        events.forEach((eventName) => {
            if (!this.pullRequestCallbacks.has(eventName)) {
                this.pullRequestCallbacks.set(eventName, []);
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.pullRequestCallbacks.get(eventName)!.push(callback);
        });
    }

    async execute(payload: PullRequestPayload): Promise<void> {
        const eventName = payload.action;

        const callbacks = this.pullRequestCallbacks.get(eventName);
        if (callbacks) {
            for (const callback of callbacks) {
                await callback(payload);
            }
        }
    }
}
