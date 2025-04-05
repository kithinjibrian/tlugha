"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exec;
const types_1 = require("./types");
const path = require("path-browserify");
function exec(filepath) {
    let module = new types_1.Module("root");
    const a = path.parse(filepath);
    try {
        return (0, types_1.lugha)({
            file: a.base,
            wd: a.dir,
            module,
            before_run: [
                ({ root }) => {
                    Object.entries(types_1.builtin)
                        .map(([key, value]) => {
                        if (value.type == "function") {
                            const inbuiltFunction = new types_1.FunctionDecNode(new types_1.IdentifierNode(key), undefined, new types_1.BlockNode([]), true, value.async);
                            root.frame.define(key, inbuiltFunction);
                        }
                    });
                },
                ({ current }) => {
                    let module = new types_1.Module("std");
                    current.add_submodule(module);
                    try {
                        (0, types_1.lugha)({
                            file: "mod.la",
                            wd: path.join(__dirname, "../std"),
                            module
                        });
                    }
                    catch (error) {
                        throw error;
                    }
                }
            ]
        }).call_main();
    }
    catch (error) {
        throw error;
    }
}
