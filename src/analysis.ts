import { inject, injectable, named } from "inversify";
import * as github from "@actions/github";
import { Handler } from "./api/handler";
import { MultiInjectProvider } from "./api/multi-inject-provider";

@injectable()
export class Analysis {
    @inject(MultiInjectProvider)
    @named(Handler)
    protected readonly handlers: MultiInjectProvider<Handler>;

    async analyze(context: typeof github.context): Promise<void> {
        for (const handler of this.handlers.getAll()) {
            if (handler.supports(context.eventName)) {
                await handler.handle(context.eventName, context.payload);
            }
        }
    }
}
