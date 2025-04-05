"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lugha = lugha;
const types_1 = require("../types");
const path = require("path-browserify");
const fs_1 = require("fs");
function lugha({ file, wd, module, before_run }) {
    const file_path = path.join(wd, file);
    const code = (0, fs_1.readFileSync)(file_path, 'utf-8');
    try {
        let lexer = new types_1.Lexer(code);
        let tokens = lexer.tokenize();
        let parser = new types_1.Parser(tokens);
        let ast = parser.parse();
        return new types_1.Engine(ast, module, wd, lugha).run(before_run);
    }
    catch (error) {
        throw error;
    }
}
