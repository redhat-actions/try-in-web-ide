import { Container, type Bind, type ServiceIdentifier } from "inversify";

type NonPrimitive = Record<string, unknown>;

export const MultiInjectProvider = Symbol.for("MultiInjectProvider");
export interface MultiInjectProvider<T extends NonPrimitive> {
    getAll(): T[];
}

class DefaultMultiInjectProvider<T extends NonPrimitive> implements MultiInjectProvider<T> {
    constructor(private readonly services: T[]) {}

    getAll(): T[] {
        return this.services;
    }
}

export function bindMultiInjectProvider(bindable: Bind | Container, id: ServiceIdentifier): void {
    const bindFn: Bind = typeof bindable === "function"
        ? bindable
        : bindable.bind.bind(bindable);

    bindFn(MultiInjectProvider)
        .toDynamicValue((ctx) => {
            try {
                return new DefaultMultiInjectProvider(ctx.getAll(id) as NonPrimitive[]);
            }
            catch {
                return new DefaultMultiInjectProvider([]);
            }
        })
        .inSingletonScope()
        .whenNamed(id as symbol);
}
