import { ContainerModule, interfaces } from "inversify";
import { AddCommentHelper } from "./add-comment-helper";
import { AddStatusCheckHelper } from "./add-status-check-helper";

const helpersModule = new ContainerModule((bind: interfaces.Bind) => {
    bind(AddCommentHelper).toSelf().inSingletonScope();
    bind(AddStatusCheckHelper).toSelf().inSingletonScope();
});

export { helpersModule };
