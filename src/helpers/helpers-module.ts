import { ContainerModule, interfaces } from "inversify";
import { AddCommentHelper } from "./add-comment-helper";
import { AddStatusCheckHelper } from "./add-status-check-helper";
import { UpdateCommentHelper } from "./update-comment-helper";

const helpersModule = new ContainerModule((bind: interfaces.Bind) => {
    bind(AddCommentHelper).toSelf().inSingletonScope();
    bind(AddStatusCheckHelper).toSelf().inSingletonScope();
    bind(UpdateCommentHelper).toSelf().inSingletonScope();
});

export { helpersModule };
