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
exports.lugha = lugha;
const types_1 = require("../types");
const path = require("path-browserify");
const fs_1 = require("fs");
function lugha(_a) {
    return __awaiter(this, arguments, void 0, function* ({ file, wd, module, before_run }) {
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
    });
}
