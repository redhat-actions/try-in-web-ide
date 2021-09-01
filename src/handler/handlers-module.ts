import { ContainerModule, interfaces } from "inversify";
import { Handler } from "../api/handler";
import { PullRequestHandler } from "./pull-request-handler";
import { bindMultiInjectProvider } from "../api/multi-inject-provider";

const handlersModule = new ContainerModule((bind: interfaces.Bind) => {
    bindMultiInjectProvider(bind, Handler);
    bind(Handler).to(PullRequestHandler).inSingletonScope();
});

export { handlersModule };
