import { PullRequestPayload } from "../types/pull-request-payload";

export const PullRequestListener = Symbol.for("PullRequestListener");
export type PullRequestListener = {
    execute(payload: PullRequestPayload): Promise<void>;
};
