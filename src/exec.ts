import { create_object } from "./objects/create";
import {
    BlockNode,
    builtin,
    FunctionDecNode,
    IdentifierNode,
    lugha,
    Module,
    VariableNode
} from "./types";

import * as path from 'path-browserify';

export async function exec(filepath: string) {
    let module: Module = new Module("root");
    const a = path.parse(filepath)

    try {
        const engine = await lugha({
            module,
            wd: a.dir,
            rd: a.dir,
            file: a.base,
            before_run: [
                async ({ root }: { root: Module }) => {
                    Object.entries(builtin)
                        .map(([key, value]) => {
                            if (value.type == "function") {
                                const inbuiltFunction = new FunctionDecNode(
                                    new IdentifierNode(key),
                                    undefined,
                                    new BlockNode([]),
                                    true,
                                    value.async
                                );
                                root.frame.define(key, inbuiltFunction);
                            } else if (value.type == "variable") {
                                const inbuiltVariable = new VariableNode(
                                    new IdentifierNode(key),
                                    true,
                                    false,
                                    undefined,
                                    create_object(value.value)
                                );

                                root.frame.define(key, inbuiltVariable);
                            }
                        })
                },
                async ({ current }: { current: Module }) => {
                    let module = new Module("std");
                    current.add_submodule(module);

                    try {
                        await lugha({
                            module,
                            rd: __dirname,
                            file: "__mod__.la",
                            wd: path.join(__dirname, "../std"),
                        })
                    } catch (error) {
                        throw error;
                    }
                }
            ]
        })

        return await engine.call_main();
    } catch (error) {
        throw error;
    }

}