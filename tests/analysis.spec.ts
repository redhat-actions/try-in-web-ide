import "reflect-metadata";

import { Container } from "inversify";
import { Analysis } from "../src/analysis";
import { Handler } from "../src/api/handler";
import { bindMultiInjectProvider } from "../src/api/multi-inject-provider";

describe("Test Analysis", () => {
    let container: Container;

    beforeEach(() => {
        container = new Container();
        bindMultiInjectProvider(container, Handler);
        container.bind(Analysis).toSelf().inSingletonScope();
    });

    test("test handle accepted", async () => {
        const handler1: Handler = {
            supports: jest.fn(),
            handle: jest.fn(),
        };
        // first handler supports the call
        (handler1.supports as jest.Mock).mockReturnValue(true);

        container.bind(Handler).toConstantValue(handler1);

        const eventName1 = "eventName1";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const context1: any = {
            eventName: eventName1,
            payload: jest.fn(),
        };

        const analysis = container.get(Analysis);
        await analysis.analyze(context1);

        expect(handler1.supports).toBeCalled();
        expect(handler1.handle).toBeCalled();
        const call = (handler1.handle as jest.Mock).mock.calls[0];

        expect(call[0]).toEqual(eventName1);
        expect(call[1]).toEqual(context1.payload);
    });

    test("test handle refused", async () => {
        const handler1: Handler = {
            supports: jest.fn(),
            handle: jest.fn(),
        };
        // handler does not support the call
        (handler1.supports as jest.Mock).mockReturnValue(false);

        container.bind(Handler).toConstantValue(handler1);

        const eventName1 = "eventName1";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const context1: any = {
            eventName: eventName1,
            payload: jest.fn(),
        };

        const analysis = container.get(Analysis);
        await analysis.analyze(context1);

        expect(handler1.supports).toBeCalled();
        expect(handler1.handle).toHaveBeenCalledTimes(0);
    });
});
