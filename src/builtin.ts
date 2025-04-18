import axios from "axios"
import { Type } from "./objects/base"
import { readFile, writeFile } from "fs/promises"

export type Builtin =
    {
        type: "function",
        async?: boolean,
        signature: string,
        filter?: (args: Type<any>[]) => any,
        exec: (args: Type<any>[]) => any
    }
    | {
        type: "variable",
        signature?: string,
        value: any
    }

export const builtin: Record<string, Builtin> = {
    __version__: {
        type: "variable",
        signature: "string",
        value: "Lugha v1.0.0"
    },
    __now__: {
        type: "function",
        signature: "<T, U>(args: T) -> U",
        exec: (args: any[]) => {
            return new Date();
        }
    },
    __print__: {
        type: "function",
        signature: "<T, U>(args: T) -> U",
        exec: (args: any[]) => {
            let formatted = args[0];
            const values = args[1];

            let index = 0;
            formatted = formatted.replace(/\{\}/g, () => {
                const val = index < values.length ? values[index++] : "{}";
                return JSON.stringify(val, null, 2);
            });

            console.log(formatted);

            return null;
        }
    },
    __http_get__: {
        type: "function",
        async: true,
        signature: "<T, U>(args: T) -> U",
        exec: async (args: any[]) => {
            try {
                const res = await axios.get(args[0], args[1]);
                const { config, request, ...rest } = res;
                return rest;
            } catch (e) {
                console.log(e)
            }
        }
    },
    __http_post__: {
        type: "function",
        async: true,
        signature: "<T, U>(args: T) -> U",
        exec: async (args: any[]) => {
            try {
                const res = await axios.post(args[0], args[1], args[2]);
                const { config, request, ...rest } = res;
                return rest;
            } catch (e) {
                console.log(e)
            }
        }
    },
    __read__: {
        type: "function",
        async: true,
        signature: "<T, U>(args: T) -> U",
        exec: async (args: any[]) => {
            try {
                const res = await readFile(args[0], args[1]);
                return res;
            } catch (e) {
                console.log(e)
            }
        }
    },
    __write__: {
        type: "function",
        async: true,
        signature: "<T, U>(args: T) -> U",
        exec: async (args: any[]) => {
            try {
                await writeFile(args[0], args[1]);
            } catch (e) {
                console.log(e)
            }
        }
    }
}