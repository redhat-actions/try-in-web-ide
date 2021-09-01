import { ContainerModule, interfaces } from "inversify";
import { PullRequestAction } from "./pull-request-action";
import { PullRequestListener } from "../api/pull-request-listener";

const actionsModule = new ContainerModule((bind: interfaces.Bind) => {
    bind(PullRequestAction).toSelf().inSingletonScope();
    bind(PullRequestListener).toService(PullRequestAction);
});

export { actionsModule };
