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
exports.Engine = void 0;
const types_1 = require("../types");
const module_1 = require("../module/module");
const array_1 = require("../objects/array");
const function_1 = require("../objects/function");
const lambda_1 = require("../objects/lambda");
const map_1 = require("../objects/map");
const number_1 = require("../objects/number");
const set_1 = require("../objects/set");
const string_1 = require("../objects/string");
const tuple_1 = require("../objects/tuple");
const fs_1 = require("fs");
const path = require("path-browserify");
const create_1 = require("../objects/create");
class Engine {
    constructor(ast, root, wd, lugha) {
        this.ast = ast;
        this.root = root;
        this.wd = wd;
        this.lugha = lugha;
        this.plugins = [];
        this.current = this.root;
    }
    plugin(p) {
        this.plugins.push(p);
        return this;
    }
    before_accept(node, args) {
        // console.log(node.type)
        this.plugins.forEach(plugin => { var _a; return (_a = plugin.beforeAccept) === null || _a === void 0 ? void 0 : _a.call(plugin, node, this, args); });
    }
    visit(node, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (node == undefined)
                return;
            const handledByPlugin = this.plugins.some(plugin => { var _a; return (_a = plugin.handleNode) === null || _a === void 0 ? void 0 : _a.call(plugin, node, this, args); });
            if (!handledByPlugin) {
                try {
                    yield node.accept(this, args);
                }
                catch (error) {
                    throw error;
                }
            }
        });
    }
    after_accept(node, args) {
        this.plugins.forEach(plugin => { var _a; return (_a = plugin.afterAccept) === null || _a === void 0 ? void 0 : _a.call(plugin, node, this, args); });
    }
    execute_function(fn, args, frame) {
        return __awaiter(this, void 0, void 0, function* () {
            const new_frame = new module_1.Frame(frame);
            if (fn.params) {
                fn.params.parameters.forEach((param, i) => {
                    let _param = param;
                    let value = undefined;
                    if (_param.variadic) {
                        const rest = [];
                        for (let y = i; y < args.length; y++) {
                            rest.push(args[y]);
                        }
                        value = new tuple_1.TupleType(rest);
                    }
                    else if (i < args.length) {
                        value = args[i];
                    }
                    new_frame.define(_param.identifier.name, new types_1.ParameterNode(_param.identifier, _param.variadic, _param.data_type, _param.expression, value));
                });
            }
            if (fn.inbuilt) {
                const name = fn.identifier.name;
                const inbuilt = types_1.builtin[name];
                if (inbuilt.type != "function") {
                    throw new Error(`Object ${name} not callable`);
                }
                const filtered = inbuilt.filter
                    ? inbuilt.filter(args)
                    : args.map(i => i.getValue());
                let value;
                if (inbuilt.async) {
                    try {
                        value = yield inbuilt.exec(filtered);
                    }
                    catch (e) {
                        value = e.message;
                    }
                }
                else {
                    value = inbuilt.exec(filtered);
                }
                if (value)
                    frame.stack.push((0, create_1.create_object)(value));
            }
            else {
                yield this.visit(fn.body, { frame: new_frame });
                if (new_frame.return_value)
                    frame.stack.push(new_frame.return_value);
            }
        });
    }
    run(before_run) {
        return __awaiter(this, void 0, void 0, function* () {
            if (before_run) {
                before_run.map((fn) => __awaiter(this, void 0, void 0, function* () {
                    return yield fn({
                        root: this.root,
                        current: this.current
                    });
                }));
            }
            yield this.visit(this.ast, { frame: this.root.frame });
            return this;
        });
    }
    call_main() {
        return __awaiter(this, void 0, void 0, function* () {
            let main = this.root.frame.get("main");
            yield this.execute_function(main, [], this.root.frame);
            let ret = this.root.frame.stack.pop();
            if (ret) {
                return ret.getValue();
            }
            return null;
        });
    }
    visitProgram(node, args) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.visit(node.program, args);
        });
    }
    visitSourceElements(node, args) {
        return __awaiter(this, void 0, void 0, function* () {
            node.sources.forEach((src) => __awaiter(this, void 0, void 0, function* () {
                yield this.visit(src, args);
            }));
        });
    }
    visitExpressionStatement(node, args) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.visit(node.expression, args);
        });
    }
    visitModule(node, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = this.current;
            const new_module = new module_1.Module(node.identifier.name);
            this.current.add_submodule(new_module);
            this.current = new_module;
            node.body.forEach((src) => __awaiter(this, void 0, void 0, function* () {
                yield this.visit(src, Object.assign(Object.assign({}, args), { frame: new_module.frame }));
            }));
            this.current = cache;
        });
    }
    visitImport(node, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalWd = this.wd;
            const name = node.identifier.name;
            const filePath = path.join(originalWd, `${name}.la`);
            let fileToImport = `${name}.la`;
            let importWd = originalWd;
            if (!(0, fs_1.existsSync)(filePath)) {
                const subPath = path.join(originalWd, name, "__mod__.la");
                if ((0, fs_1.existsSync)(subPath)) {
                    fileToImport = "__mod__.la";
                    importWd = path.join(originalWd, name);
                }
                else {
                    throw new Error(`Couldn't find module: '${name}'`);
                }
            }
            const module = new module_1.Module(node.identifier.name);
            this.current.add_submodule(module);
            yield this.lugha({
                file: fileToImport,
                wd: importWd,
                module
            });
        });
    }
    visitUse(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            var _b;
            const self = this;
            function resolveModule(path) {
                let mod = self.root.children.find(m => m.name === path[0]);
                if (!mod)
                    throw new Error(`Undefined module: '${path[0]}'`);
                for (let i = 1; i < path.length; i++) {
                    mod = mod.children.find(m => m.name === path[i]);
                    if (!mod)
                        throw new Error(`Undefined module at '${path.slice(0, i + 1).join(".")}'`);
                }
                return mod;
            }
            if (node.list) {
                const module = resolveModule(node.path.path);
                if (!module)
                    return;
                node.list.items.forEach(item => {
                    var _a;
                    const symbol = module.frame.get(item.name);
                    frame.define((_a = item.alias) !== null && _a !== void 0 ? _a : item.name, symbol);
                });
            }
            else {
                const path = node.path.path;
                const module = resolveModule(path.slice(0, -1));
                if (!module)
                    return;
                const symbol = module.frame.get(path[path.length - 1]);
                frame.define((_b = node.alias) !== null && _b !== void 0 ? _b : path[path.length - 1], symbol);
            }
        });
    }
    visitFunctionDec(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            frame.define(node.identifier.name, node);
        });
    }
    visitLambda(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            frame.stack.push(new lambda_1.LambdaType(node));
        });
    }
    visitBlock(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            const new_frame = new module_1.Frame(frame);
            for (const n of node.body) {
                yield this.visit(n, { frame: new_frame });
                if (new_frame.return_flag ||
                    new_frame.break_flag ||
                    new_frame.continue_flag) {
                    break;
                }
            }
            frame.continue_flag = new_frame.continue_flag;
            frame.break_flag = new_frame.break_flag;
            frame.return_flag = new_frame.return_flag;
            frame.return_value = new_frame.return_value;
        });
    }
    visitCallExpression(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            const evaluatedArgs = [];
            for (const arg of node.args) {
                yield this.visit(arg, { frame });
                const argValue = frame.stack.pop();
                if (!argValue)
                    throw new Error("Stack underflow - argument evaluation");
                evaluatedArgs.push(argValue);
            }
            if (node.callee instanceof types_1.ScopedIdentifierNode) {
                yield this.visit(node.callee, { frame });
                const fn = frame.stack.pop();
                if (!fn) {
                    throw new Error(`Function ${node.callee.name[0]} is not defined`);
                }
                yield this.execute_function(fn.getValue(), evaluatedArgs, frame);
            }
            else {
                yield this.visit(node.callee, { frame, args: evaluatedArgs });
                const fn = frame.stack.pop();
                yield this.execute_function(fn.getValue(), evaluatedArgs, frame);
            }
        });
    }
    visitMemberExpression(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame, args }) {
            yield this.visit(node.object, { frame });
            const object = frame.stack.pop();
            let propertyValue;
            if (node.computed) {
                yield this.visit(node.property, { frame });
                propertyValue = frame.stack.pop();
            }
            else {
                let name = node.property.name;
                propertyValue = new string_1.StringType(name);
            }
            const value = object.get(propertyValue, args);
            if (!value) {
                throw new Error("Property not found");
            }
            frame.stack.push(value);
        });
    }
    visitVariableList(node, args) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.visit(node.variables, args);
        });
    }
    visitVariable(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            let value = null;
            if (node.expression) {
                yield this.visit(node.expression, { frame });
                value = frame.stack.pop();
            }
            if ((value === null || value === void 0 ? void 0 : value.getType()) == "function") {
                frame.define(node.identifier.name, value.getValue());
            }
            else {
                node.value = value;
                frame.define(node.identifier.name, node);
            }
        });
    }
    visitBinaryOp(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            yield this.visit(node.left, { frame });
            const left = frame.stack.pop();
            if (!left)
                throw new Error("Stack underflow - left operand");
            yield this.visit(node.right, { frame });
            const right = frame.stack.pop();
            if (!right)
                throw new Error("Stack underflow - right operand");
            let result;
            switch (node.operator) {
                case "+":
                    result = left.add(right);
                    break;
                case "-":
                    result = left.minus(right);
                    break;
                case "*":
                    result = left.multiply(right);
                    break;
                case "/":
                    result = left.divide(right);
                    break;
                case "%":
                    result = left.modulo(right);
                    break;
                case "<":
                    result = left.lt(right);
                    break;
                case ">":
                    result = left.gt(right);
                    break;
                case "==":
                    result = left.eq(right);
                    break;
                case "!=":
                    result = left.neq(right);
                    break;
                default:
                    throw new Error(`Unsupported operator: ${node.operator}`);
            }
            frame.stack.push(result);
        });
    }
    visitScopedIdentifier(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            let __p = (frame, search_frame, name) => {
                const symbol = search_frame.get(name);
                if (!symbol) {
                    throw new Error(`Symbol '${name}' is not defined`);
                }
                if (symbol instanceof types_1.VariableNode ||
                    symbol instanceof types_1.ParameterNode) {
                    frame.stack.push(symbol.value);
                }
                else {
                    frame.stack.push(new function_1.FunctionType(symbol));
                }
            };
            let current;
            if (node.name.length == 1) {
                __p(frame, frame, node.name[0]);
                return;
            }
            else if (node.name[0] === "self") {
                current = this.current; // Current module
            }
            else if (node.name[0] === "super") {
                if (!this.current.parent) {
                    throw new Error(`'super' used in root module`);
                }
                current = this.current.parent; // Parent module
            }
            else {
                current = this.root.children.find(m => m.name === node.name[0]);
                if (!current) {
                    throw new Error(`Undefined module: '${node.name[0]}'`);
                }
            }
            for (let i = 1; i < node.name.length - 1; i++) {
                if (current) {
                    current = current.children.find(m => m.name === node.name[i]);
                }
                else {
                    throw new Error(`Undefined module: '${node.name[1]}'`);
                }
            }
            if (current === null || current === void 0 ? void 0 : current.frame)
                __p(frame, current.frame, node.name[node.name.length - 1]);
        });
    }
    visitReturn(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            if (node.expression) {
                yield this.visit(node.expression, { frame });
                frame.return_value = frame.stack.pop();
            }
            frame.return_flag = true;
        });
    }
    visitMap(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            const objectProperties = {};
            for (const propNode of node.properties) {
                yield this.visit(propNode.value, { frame });
                const value = frame.stack.pop();
                let key = propNode.key;
                objectProperties[key] = value;
            }
            frame.stack.push(new map_1.MapType(objectProperties));
        });
    }
    visitSet(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            const values = yield Promise.all(node.values.map((src) => __awaiter(this, void 0, void 0, function* () {
                yield this.visit(src, { frame });
                return frame.stack.pop();
            })));
            frame.stack.push(new set_1.SetType(values));
        });
    }
    visitArray(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            const values = yield Promise.all(node.elements.map((src) => __awaiter(this, void 0, void 0, function* () {
                yield this.visit(src, { frame });
                return frame.stack.pop();
            })));
            frame.stack.push(new array_1.ArrayType(values));
        });
    }
    visitTuple(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            const values = yield Promise.all(node.values.map((src) => __awaiter(this, void 0, void 0, function* () {
                yield this.visit(src, { frame });
                return frame.stack.pop();
            })));
            frame.stack.push(new tuple_1.TupleType(values));
        });
    }
    visitNumber(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            frame.stack.push(new number_1.NumberType(node.value));
        });
    }
    visitString(node_1, _a) {
        return __awaiter(this, arguments, void 0, function* (node, { frame }) {
            frame.stack.push(new string_1.StringType(node.value));
        });
    }
}
exports.Engine = Engine;
