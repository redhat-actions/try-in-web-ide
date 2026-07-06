import { ContainerModule } from "inversify";
import { HandlePullRequestLogic } from "./handle-pull-request-logic";
import { Logic } from "../api/logic";
import { bindMultiInjectProvider } from "../api/multi-inject-provider";

const logicModule = new ContainerModule(({ bind }) => {
    bindMultiInjectProvider(bind, Logic);
    bind(Logic).to(HandlePullRequestLogic).inSingletonScope();
});

export { logicModule };
