import request from "sync-request"
import { Type } from "./objects/base"

export type Builtin =
    {
        type: "function",
        async?: boolean,
        signature: string,
        filter?: (args: Type<any>[]) => any,
        exec: Function
    }
    | {
        type: "variable",
        signature?: string,
        value: any
    }

export const builtin: Record<string, Builtin> = {
    __print__: {
        type: "function",
        signature: "<T, U>(args: T) -> U",
        exec: (args: any[]) => {
            let formatted = args[0];

            args[1].forEach((arg: any) => {
                formatted = formatted.replace("{}", JSON.stringify(arg, null, 2));
            });

            console.log(formatted)
        }
    },
    __http_get__: {
        type: "function",
        async: true,
        signature: "<T, U>(args: T) -> U",
        exec: (args: any[]) => {
            let result = request('GET', args[0], {
                headers: args[1]
            });
            return JSON.parse(result.getBody('utf8'));
        }
    },
    __http_post__: {
        type: "function",
        async: true,
        signature: "<T, U>(args: T) -> U",
        exec: (args: any[]) => {
            let result = request('POST', args[0], {
                json: args[1],
                headers: args[2]
            });
            return JSON.parse(result.getBody('utf8'));
        }
    }
}