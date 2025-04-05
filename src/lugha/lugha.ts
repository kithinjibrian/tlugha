import {
    Engine,
    Lexer,
    Module,
    Parser
} from "../types";

import * as path from 'path-browserify';
import { readFileSync } from "fs"

export function lugha({
    file,
    wd,
    module,
    before_run
}: {
    file: string,
    wd: string,
    module: Module,
    before_run?: Function[]
}): Engine {
    const file_path = path.join(wd, file);
    const code = readFileSync(file_path, 'utf-8')

    try {
        let lexer = new Lexer(code);
        let tokens = lexer.tokenize();

        let parser = new Parser(tokens);
        let ast = parser.parse();

        return new Engine(
            ast,
            module,
            wd,
            lugha
        ).run(before_run);

    } catch (error: any) {
        throw error;
    }

}   