export interface PullRequestRef {
    ref: string;
    sha: string;
    repo: {
        html_url: string;
        clone_url: string;
        full_name: string;
    };
}

export interface PullRequestPayload {
    action: string;
    pull_request: {
        number: number;
        head: PullRequestRef;
        base: PullRequestRef;
    };
    repository: {
        name: string;
        owner: { login: string };
    };
}
