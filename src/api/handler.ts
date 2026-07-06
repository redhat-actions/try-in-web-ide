export const Handler = Symbol.for("Handler");
export type Handler = {
    supports(eventName: string): boolean;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handle(eventName: string, webhookPayLoad: Record<string, any>): Promise<void>;
};
