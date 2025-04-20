import { Extension, ExtensionStore } from "./extension/extension";
import { create_object } from "./objects/create";
import {
    ASTNode,
    ASTVisitor,
    BlockNode,
    builtin,
    Cache,
    FunctionDecNode,
    IdentifierNode,
    lugha,
    Module,
    VariableNode
} from "./types";

import * as path from 'path-browserify';

class UploadBuiltins extends Extension<ASTVisitor> {
    public name = "UploadBuiltins";

    async before_accept() { }

    async after_accept() { }

    async handle_node() { }

    async after_main() { }

    before_run() {
        return [
            async ({ root, }: { root: Module }) => {
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
                let module;

                let cache = Cache.get_instance();
                const wd = path.join(__dirname, "../std");
                const mod_path = path.join(wd, "__mod__.la")

                if (cache.has_mod(mod_path)) {
                    module = cache.get_mod(mod_path);
                } else {
                    module = new Module("std");
                }

                current.add_submodule(module);

                if (!cache.has_mod(mod_path)) {
                    cache.add_mod(mod_path, module);

                    try {
                        ExtensionStore.get_instance().unregister("UploadBuiltins")

                        await lugha({
                            module,
                            rd: __dirname,
                            file: "__mod__.la",
                            wd,
                        })

                        ExtensionStore.get_instance().register(new UploadBuiltins())

                    } catch (error) {
                        throw error;
                    }
                }
            }
        ]
    }
}

export async function exec({
    filepath
}: {
    filepath: string
}) {
    let module: Module = new Module("root");
    const a = path.parse(filepath);

    ExtensionStore.get_instance().register(new UploadBuiltins())

    try {
        const engine = await lugha({
            module,
            wd: a.dir,
            rd: a.dir,
            file: a.base
        })

        return await engine.call_main();

    } catch (error) {
        throw error;
    } finally {
        Cache.get_instance().clear_cache()
    }
}