"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = exports.Frame = void 0;
class Frame {
    constructor(parent = null, name = "") {
        this.parent = parent;
        this.name = name;
        this.stack = [];
        this.break_flag = false;
        this.return_flag = false;
        this.continue_flag = false;
        this.symbol_table = new Map();
        this.return_value = undefined;
    }
    define(name, value) {
        this.symbol_table.set(name, value);
    }
    get(name) {
        if (this.symbol_table.has(name)) {
            return this.symbol_table.get(name);
        }
        if (this.parent) {
            return this.parent.get(name); // Lexical scoping
        }
        return null;
    }
    assign(name, value) {
        if (this.symbol_table.has(name)) {
            this.symbol_table.set(name, value);
        }
        else if (this.parent) {
            this.parent.assign(name, value);
        }
        else {
            throw new Error(`Undefined variable: ${name}`);
        }
    }
}
exports.Frame = Frame;
class Module {
    constructor(name) {
        this.name = name;
        this.parent = null;
        this.children = [];
        this.frame = new Frame(null, `${this.name}_frame`);
    }
    add_submodule(child) {
        child.parent = this;
        this.children.push(child);
    }
}
exports.Module = Module;
