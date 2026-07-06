import { ContainerModule } from "inversify";
import { Handler } from "../api/handler";
import { PullRequestHandler } from "./pull-request-handler";
import { bindMultiInjectProvider } from "../api/multi-inject-provider";

const handlersModule = new ContainerModule(({ bind }) => {
    bindMultiInjectProvider(bind, Handler);
    bind(Handler).to(PullRequestHandler).inSingletonScope();
});

export { handlersModule };
