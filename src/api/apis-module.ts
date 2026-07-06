import { ContainerModule } from "inversify";
import { PullRequestListener } from "../api/pull-request-listener";
import { bindMultiInjectProvider } from "../api/multi-inject-provider";

const apisModule = new ContainerModule(({ bind }) => {
    bindMultiInjectProvider(bind, PullRequestListener);
});

export { apisModule };
