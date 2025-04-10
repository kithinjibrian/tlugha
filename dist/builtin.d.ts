import { Type } from "./objects/base";
export type Builtin = {
    type: "function";
    async?: boolean;
    signature: string;
    filter?: (args: Type<any>[]) => any;
    exec: Function;
} | {
    type: "variable";
    signature?: string;
    value: any;
};
export declare const builtin: Record<string, Builtin>;
//# sourceMappingURL=builtin.d.ts.map