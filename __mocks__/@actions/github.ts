const mockOctokit = {
    rest: {
        issues: {
            createComment: jest.fn(),
            listComments: jest.fn(),
            updateComment: jest.fn(),
        },
        repos: {
            createCommitStatus: jest.fn(),
        },
    },
};

export const getOctokit = jest.fn().mockReturnValue(mockOctokit);
export const context = {
    eventName: "",
    payload: {},
    sha: "",
    ref: "",
    workflow: "",
    action: "",
    actor: "",
    job: "",
    runNumber: 0,
    runId: 0,
};
