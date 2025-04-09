import {
    ArrayNode,
    ASTNode,
    ASTVisitor,
    BinaryOpNode,
    BlockNode,
    builtin,
    CallExpressionNode,
    ExpressionStatementNode,
    FunctionDecNode,
    IdentifierNode,
    ImportNode,
    LambdaNode,
    MapNode,
    MemberExpressionNode,
    ModuleNode,
    NumberNode,
    ParameterNode,
    ProgramNode,
    ReturnNode,
    ScopedIdentifierNode,
    SetNode,
    SourceElementsNode,
    StringNode,
    TupleNode,
    UseNode,
    VariableNode,
    VariableStatementNode
} from "../types";
import { Frame, Module } from "../module/module";
import { ArrayType } from "../objects/array";
import { Type } from "../objects/base";
import { FunctionType } from "../objects/function";
import { LambdaType } from "../objects/lambda";
import { MapType } from "../objects/map";
import { NumberType } from "../objects/number";
import { SetType } from "../objects/set";
import { StringType } from "../objects/string";
import { TupleType } from "../objects/tuple";
import { Extension } from "../plugin/plugin";

import { existsSync } from "fs";
import * as path from 'path-browserify';
import { create_object } from "../objects/create";

export class Engine implements ASTVisitor {
    private current: Module;
    private plugins: Extension<any>[] = [];

    constructor(
        public ast: ASTNode,
        public root: Module,
        public wd: string,
        public lugha: Function
    ) {
        this.current = this.root;
    }

    public plugin(p: Extension<any>) {
        this.plugins.push(p);
        return this;
    }

    public before_accept(
        node: ASTNode,
        args?: Record<string, any>
    ) {
        // console.log(node.type)
        this.plugins.forEach(plugin => plugin.beforeAccept?.(node, this, args));
    }

    public async visit(node?: ASTNode, args?: Record<string, any>): Promise<void> {
        if (node == undefined) return;

        const handledByPlugin = this.plugins.some(plugin =>
            plugin.handleNode?.(node, this, args)
        );

        if (!handledByPlugin) {
            try {
                await node.accept(this, args);
            } catch (error) {
                throw error;
            }
        }
    }

    public after_accept(
        node: ASTNode,
        args?: Record<string, any>
    ) {
        this.plugins.forEach(plugin => plugin.afterAccept?.(node, this, args));
    }

    private async execute_function(
        fn: FunctionDecNode,
        args: Type<any>[],
        frame: Frame
    ) {
        const new_frame = new Frame(frame);

        if (fn.params) {
            fn.params.parameters.forEach((param, i) => {
                let _param: ParameterNode = param;

                let value = undefined;

                if (_param.variadic) {
                    const rest = [];

                    for (let y = i; y < args.length; y++) {
                        rest.push(args[y]);
                    }

                    value = new TupleType(rest)
                } else if (i < args.length) {
                    value = args[i];
                }

                new_frame.define(
                    _param.identifier.name, new ParameterNode(
                        _param.identifier,
                        _param.variadic,
                        _param.data_type,
                        _param.expression,
                        value,
                    ))
            });
        }

        if (fn.inbuilt) {
            const name = fn.identifier.name;
            const inbuilt = builtin[name];

            if (inbuilt.type != "function") {
                throw new Error(`Object ${name} not callable`);
            }

            const filtered = inbuilt.filter
                ? inbuilt.filter(args)
                : args.map(i => i.getValue());

            let value;
            if (inbuilt.async) {
                value = await inbuilt.exec(filtered);
            } else {
                value = inbuilt.exec(filtered)
            }

            if (value)
                frame.stack.push(create_object(value))
        } else {
            await this.visit(fn.body, { frame: new_frame })
            if (new_frame.return_value)
                frame.stack.push(new_frame.return_value);
        }
    }

    async run(before_run?: Function[]) {
        if (before_run) {
            before_run.map(async (fn) => await fn({
                root: this.root,
                current: this.current
            }))
        }

        await this.visit(this.ast, { frame: this.root.frame })
        return this;
    }

    async call_main() {
        let main = this.root.frame.get("main");
        await this.execute_function(main, [], this.root.frame);
        let ret = this.root.frame.stack.pop();

        if (ret) {
            return ret.getValue();
        }
        return null;
    }

    async visitProgram(node: ProgramNode, args?: Record<string, any>) {
        await this.visit(node.program, args);
    }

    async visitSourceElements(
        node: SourceElementsNode,
        args?: Record<string, any>
    ) {
        node.sources.forEach(async src => {
            await this.visit(src, args);
        });
    }

    async visitExpressionStatement(
        node: ExpressionStatementNode,
        args?: Record<string, any>
    ) {
        await this.visit(node.expression, args);
    }

    async visitModule(
        node: ModuleNode,
        args?: Record<string, any>
    ) {
        const cache = this.current;
        const new_module = new Module(node.identifier.name)
        this.current.add_submodule(new_module);
        this.current = new_module;

        node.body.forEach(async (src) => {
            await this.visit(src, {
                ...args,
                frame: new_module.frame,
            });
        })

        this.current = cache;
    }

    async visitImport(
        node: ImportNode,
        args?: Record<string, any>
    ) {
        let name = node.identifier.name;
        const file_path = path.join(this.wd, `${name}.la`);

        if (!existsSync(file_path)) {
            const sub_path = path.join(this.wd, name, "mod.la");
            if (sub_path) {
                this.wd = path.join(this.wd, name);
                name = "mod"
            } else {
                throw new Error(`Couldn't find module: '${name}'`);
            }
        }

        let module = new Module(node.identifier.name);
        this.current.add_submodule(module);

        await this.lugha({
            file: `${name}.la`,
            wd: this.wd,
            module
        })
    }

    async visitUse(node: UseNode, { frame }: { frame: Frame }) {
        const self = this;
        function resolveModule(path: string[]): Module | undefined {
            let mod = self.root.children.find(m => m.name === path[0]);
            if (!mod) throw new Error(`Undefined module: '${path[0]}'`);

            for (let i = 1; i < path.length; i++) {
                mod = mod.children.find(m => m.name === path[i]);
                if (!mod) throw new Error(`Undefined module at '${path.slice(0, i + 1).join(".")}'`);
            }
            return mod;
        }

        if (node.list) {
            const module = resolveModule(node.path.path);
            if (!module) return;

            node.list.items.forEach(item => {
                const symbol = module.frame.get(item.name);
                frame.define(item.alias ?? item.name, symbol);
            });
        } else {
            const path = node.path.path;
            const module = resolveModule(path.slice(0, -1));
            if (!module) return;


            const symbol = module.frame.get(path[path.length - 1]);

            frame.define(node.alias ?? path[path.length - 1], symbol);
        }
    }

    async visitFunctionDec(
        node: FunctionDecNode,
        { frame }: { frame: Frame }
    ) {
        frame.define(node.identifier.name, node);
    }

    async visitLambda(
        node: LambdaNode,
        { frame }: { frame: Frame }
    ) {
        frame.stack.push(new LambdaType(node));
    }

    async visitBlock(
        node: BlockNode,
        { frame }: { frame: Frame }
    ) {
        const new_frame = new Frame(frame);

        for (const n of node.body) {
            await this.visit(n, { frame: new_frame });

            if (
                new_frame.return_flag ||
                new_frame.break_flag ||
                new_frame.continue_flag
            ) {
                break;
            }
        }

        frame.continue_flag = new_frame.continue_flag;
        frame.break_flag = new_frame.break_flag;
        frame.return_flag = new_frame.return_flag;
        frame.return_value = new_frame.return_value;
    }

    async visitCallExpression(
        node: CallExpressionNode,
        { frame }: { frame: Frame }
    ) {
        const evaluatedArgs: Type<any>[] = [];
        for (const arg of node.args) {
            await this.visit(arg, { frame });
            const argValue = frame.stack.pop();
            if (!argValue) throw new Error("Stack underflow - argument evaluation");
            evaluatedArgs.push(argValue);
        }

        if (node.callee instanceof ScopedIdentifierNode) {
            await this.visit(node.callee, { frame });
            const fn: FunctionType = frame.stack.pop();
            if (!fn) {
                throw new Error(`Function ${node.callee.name[0]} is not defined`);
            }

            await this.execute_function(fn.getValue(), evaluatedArgs, frame);
        } else {
            await this.visit(node.callee, { frame, args: evaluatedArgs });
            const fn = frame.stack.pop() as FunctionType;

            await this.execute_function(fn.getValue(), evaluatedArgs, frame);
        }

    }

    async visitMemberExpression(
        node: MemberExpressionNode,
        { frame, args }: { frame: Frame, args: Type<any>[] }
    ) {
        await this.visit(node.object, { frame });
        const object = frame.stack.pop() as Type<any>;

        let propertyValue: Type<any>;
        if (node.computed) {
            await this.visit(node.property, { frame });
            propertyValue = frame.stack.pop() as Type<any>;
        } else {
            let name = (node.property as IdentifierNode).name;
            propertyValue = new StringType(name);
        }

        const value = object.get(propertyValue, args);
        if (!value) {
            throw new Error("Property not found");
        }

        frame.stack.push(value);
    }

    async visitVariableList(
        node: VariableStatementNode,
        args?: Record<string, any>
    ) {
        await this.visit(node.variables, args);
    }

    async visitVariable(
        node: VariableNode,
        { frame }: { frame: Frame }
    ) {
        let value: Type<any> | null = null;

        if (node.expression) {
            await this.visit(node.expression, { frame });
            value = frame.stack.pop() as Type<any>;
        }

        if (value?.getType() == "function") {
            frame.define(node.identifier.name, value.getValue());
        } else {
            node.value = value;
            frame.define(node.identifier.name, node);
        }
    }

    async visitBinaryOp(
        node: BinaryOpNode,
        { frame }: { frame: Frame }
    ) {
        await this.visit(node.left, { frame })
        const left = frame.stack.pop();
        if (!left) throw new Error("Stack underflow - left operand");

        await this.visit(node.right, { frame })
        const right = frame.stack.pop();
        if (!right) throw new Error("Stack underflow - right operand");

        let result: Type<any>;
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
    }

    async visitScopedIdentifier(
        node: ScopedIdentifierNode,
        { frame }: { frame: Frame }
    ) {
        let __p = (frame: Frame, search_frame: Frame, name: string) => {
            const symbol = search_frame.get(name);

            if (!symbol) {
                throw new Error(`Symbol '${name}' is not defined`);
            }

            if (symbol instanceof VariableNode ||
                symbol instanceof ParameterNode
            ) {
                frame.stack.push(symbol.value);
            } else {
                frame.stack.push(new FunctionType(symbol));
            }
        }

        let current: Module | undefined;
        if (node.name.length == 1) {
            __p(frame, frame, node.name[0]);
            return;
        } else if (node.name[0] === "self") {
            current = this.current; // Current module
        } else if (node.name[0] === "super") {
            if (!this.current.parent) {
                throw new Error(`'super' used in root module`);
            }
            current = this.current.parent; // Parent module
        } else {
            current = this.root.children.find(m => m.name === node.name[0]);

            if (!current) {
                throw new Error(`Undefined module: '${node.name[0]}'`);
            }
        }

        for (let i = 1; i < node.name.length - 1; i++) {
            if (current) {
                current = current.children.find(m => m.name === node.name[i]);
            } else {
                throw new Error(`Undefined module: '${node.name[1]}'`);
            }
        }

        if (current?.frame)
            __p(frame, current.frame, node.name[node.name.length - 1])
    }

    async visitReturn(
        node: ReturnNode,
        { frame }: { frame: Frame }
    ) {
        if (node.expression) {
            await this.visit(node.expression, { frame });
            frame.return_value = frame.stack.pop() as Type<any>;
        }

        frame.return_flag = true;
    }

    async visitMap(
        node: MapNode,
        { frame }: { frame: Frame }
    ) {
        const objectProperties: Record<string, Type<any>> = {};

        for (const propNode of node.properties) {
            await this.visit(propNode.value, { frame });
            const value = frame.stack.pop() as Type<any>;

            let key: string = propNode.key;

            objectProperties[key] = value;
        }

        frame.stack.push(new MapType(objectProperties));
    }

    async visitSet(
        node: SetNode,
        { frame }: { frame: Frame }
    ) {
        const values = await Promise.all(node.values.map(async (src) => {
            await this.visit(src, { frame });
            return frame.stack.pop() as Type<any>;
        }));

        frame.stack.push(new SetType(values));
    }

    async visitArray(node: ArrayNode, { frame }: { frame: Frame }) {
        const values = await Promise.all(node.elements.map(async (src) => {
            await this.visit(src, { frame });
            return frame.stack.pop() as Type<any>;
        }));

        frame.stack.push(new ArrayType(values));
    }

    async visitTuple(node: TupleNode, { frame }: { frame: Frame }) {
        const values = await Promise.all(node.values.map(async (src) => {
            await this.visit(src, { frame });
            return frame.stack.pop() as Type<any>;
        }));

        frame.stack.push(new TupleType(values));
    }

    async visitNumber(
        node: NumberNode,
        { frame }: { frame: Frame }
    ) {
        frame.stack.push(new NumberType(node.value));
    }

    async visitString(
        node: StringNode,
        { frame }: { frame: Frame }
    ) {
        frame.stack.push(new StringType(node.value));
    }
}