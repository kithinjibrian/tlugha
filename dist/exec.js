"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exec;
const create_1 = require("./objects/create");
const types_1 = require("./types");
const path = require("path-browserify");
function exec(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        let module = new types_1.Module("root");
        const a = path.parse(filepath);
        try {
            const engine = yield (0, types_1.lugha)({
                file: a.base,
                wd: a.dir,
                module,
                before_run: [
                    (_a) => __awaiter(this, [_a], void 0, function* ({ root }) {
                        Object.entries(types_1.builtin)
                            .map(([key, value]) => {
                            if (value.type == "function") {
                                const inbuiltFunction = new types_1.FunctionDecNode(new types_1.IdentifierNode(key), undefined, new types_1.BlockNode([]), true, value.async);
                                root.frame.define(key, inbuiltFunction);
                            }
                            else if (value.type == "variable") {
                                const inbuiltVariable = new types_1.VariableNode(new types_1.IdentifierNode(key), true, false, undefined, (0, create_1.create_object)(value.value));
                                root.frame.define(key, inbuiltVariable);
                            }
                        });
                    }),
                    (_a) => __awaiter(this, [_a], void 0, function* ({ current }) {
                        let module = new types_1.Module("std");
                        current.add_submodule(module);
                        try {
                            yield (0, types_1.lugha)({
                                file: "__mod__.la",
                                wd: path.join(__dirname, "../std"),
                                module
                            });
                        }
                        catch (error) {
                            throw error;
                        }
                    })
                ]
            });
            return yield engine.call_main();
        }
        catch (error) {
            throw error;
        }
    });
}
