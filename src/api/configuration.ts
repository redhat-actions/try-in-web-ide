export const Configuration = Symbol.for("Configuration");
export interface Configuration {
    addComment(): boolean;

    addStatus(): boolean;

    webIdeInstance(): string;

    commentBadge(): string;
}
