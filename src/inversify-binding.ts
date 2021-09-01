import { Container } from "inversify";
import { Octokit } from "@octokit/rest";
import { Analysis } from "./analysis";
import { Configuration } from "./api/configuration";
import { Logic } from "./api/logic";
import { OctokitBuilder } from "./github/octokit-builder";
import { actionsModule } from "./actions/actions-module";
import { apisModule } from "./api/apis-module";
import { handlersModule } from "./handler/handlers-module";
import { helpersModule } from "./helpers/helpers-module";
import { logicModule } from "./logic/logic-module";

export class InversifyBinding {
    private container: Container;

    constructor(
        private readonly githubToken: string,
        private readonly addComment: boolean,
        private readonly addStatus: boolean,
        private readonly webIdeInstance: string
    ) {}

    public initBindings(): Container {
        this.container = new Container();

        this.container.load(actionsModule);
        this.container.load(apisModule);
        this.container.load(handlersModule);
        this.container.load(helpersModule);
        this.container.load(logicModule);

        // configuration
        const configuration: Configuration = {
            addComment: () => this.addComment,
            addStatus: () => this.addStatus,
            webIdeInstance: () => this.webIdeInstance,
        };
        this.container.bind(OctokitBuilder).toSelf().inSingletonScope();
        const writeOctokit = this.container
            .get(OctokitBuilder)
            .build(this.githubToken);
        this.container.bind(Octokit).toConstantValue(writeOctokit);

        this.container.bind(Configuration).toConstantValue(configuration);

        // Analyze
        this.container.bind(Analysis).toSelf().inSingletonScope();

        // resolve all logics to create instances
        this.container.getAll(Logic);

        return this.container;
    }
}
