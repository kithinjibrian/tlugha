import {
    Engine,
    Lexer,
    Module,
    Parser
} from "../types";

import * as path from 'path-browserify';
import { readFileSync } from "fs"

export async function lugha({
    rd,
    wd,
    file,
    module,
    before_run
}: {
    wd: string,
    rd: string,
    file: string,
    module: Module,
    before_run?: Function[]
}): Promise<Engine> {
    const file_path = path.join(wd, file);
    const code = readFileSync(file_path, 'utf-8')

    try {
        let lexer = new Lexer(code);
        let tokens = lexer.tokenize();

        let parser = new Parser(tokens);
        let ast = parser.parse();

        return new Engine(
            rd,
            wd,
            ast,
            module,
            lugha
        ).run(before_run);

    } catch (error: any) {
        throw error;
    }
}   