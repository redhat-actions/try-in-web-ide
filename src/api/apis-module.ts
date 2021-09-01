import { ContainerModule, interfaces } from "inversify";
import { PullRequestListener } from "../api/pull-request-listener";
import { bindMultiInjectProvider } from "../api/multi-inject-provider";

const apisModule = new ContainerModule((bind: interfaces.Bind) => {
    bindMultiInjectProvider(bind, PullRequestListener);
});

export { apisModule };
