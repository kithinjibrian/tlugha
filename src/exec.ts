import {
    BlockNode,
    builtin,
    FunctionDecNode,
    IdentifierNode,
    lugha,
    Module
} from "./types";

import * as path from 'path-browserify';

export function exec(filepath: string) {
    let module: Module = new Module("root");
    const a = path.parse(filepath)

    try {
        return lugha({
            file: a.base,
            wd: a.dir,
            module,
            before_run: [
                ({ root }: { root: Module }) => {
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
                            }
                        })
                },
                ({ current }: { current: Module }) => {
                    let module = new Module("std");
                    current.add_submodule(module);

                    try {
                        lugha({
                            file: "mod.la",
                            wd: path.join(__dirname, "../std"),
                            module
                        })
                    } catch (error) {
                        throw error;
                    }
                }
            ]
        }).call_main();
    } catch (error) {
        throw error;
    }

}