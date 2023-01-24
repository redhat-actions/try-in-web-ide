export const Configuration = Symbol.for("Configuration");
export interface Configuration {
    addComment(): boolean;

    addStatus(): boolean;

    setupRemotes(): boolean;

    webIdeInstance(): string;

    commentBadge(): string;
}
