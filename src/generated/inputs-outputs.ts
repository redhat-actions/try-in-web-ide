// This file was auto-generated by action-io-generator. Do not edit by hand!
export enum Inputs {
    /**
     * If 'true', the action will add comments on each PR with a link to try the PR in Web IDE
     * Required: false
     * Default: "true"
     */
    ADD_COMMENT = "add_comment",
    /**
     * If 'true', the action will add a PR status check on each PR with a link to try the PR in Web IDE
     * Required: false
     * Default: "true"
     */
    ADD_STATUS = "add_status",
    /**
     * The badge url for the comment created when 'add_comment' is 'true'
     * Required: false
     * Default: "https://img.shields.io/badge/Eclipse_Che-Hosted%20by%20Red%20Hat-525C86?logo=eclipse-che&labelColor=FDB940"
     */
    COMMENT_BADGE = "comment_badge",
    /**
     * GitHub token used to add PR comment and/or status check
     * Required: true
     * Default: None.
     */
    GITHUB_TOKEN = "github_token",
    /**
     * The base url for the web IDE instance
     * Required: false
     * Default: "https://workspaces.openshift.com"
     */
    WEB_IDE_INSTANCE = "web_ide_instance",
}

export enum Outputs {
}
