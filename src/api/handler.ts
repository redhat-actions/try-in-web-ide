import { WebhookPayload } from "@actions/github/lib/interfaces";

export const Handler = Symbol.for("Handler");
export type Handler = {
    supports(eventName: string): boolean;

    handle(eventName: string, webhookPayLoad: WebhookPayload): Promise<void>;
};
