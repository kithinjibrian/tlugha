import { ArrayNode, ASTNode, ASTVisitor, BinaryOpNode, BlockNode, CallExpressionNode, ExpressionStatementNode, FunctionDecNode, ImportNode, LambdaNode, MapNode, MemberExpressionNode, ModuleNode, NumberNode, ProgramNode, ReturnNode, ScopedIdentifierNode, SetNode, SourceElementsNode, StringNode, TupleNode, UseNode, VariableNode, VariableStatementNode } from "../types";
import { Frame, Module } from "../module/module";
import { Type } from "../objects/base";
import { Extension } from "../plugin/plugin";
export declare class Engine implements ASTVisitor {
    ast: ASTNode;
    root: Module;
    wd: string;
    lugha: Function;
    private current;
    private plugins;
    constructor(ast: ASTNode, root: Module, wd: string, lugha: Function);
    plugin(p: Extension<any>): this;
    before_accept(node: ASTNode, args?: Record<string, any>): void;
    visit(node?: ASTNode, args?: Record<string, any>): void;
    after_accept(node: ASTNode, args?: Record<string, any>): void;
    private execute_function;
    run(before_run?: Function[]): this;
    call_main(): any;
    visitProgram(node: ProgramNode, args?: Record<string, any>): void;
    visitSourceElements(node: SourceElementsNode, args?: Record<string, any>): void;
    visitExpressionStatement(node: ExpressionStatementNode, args?: Record<string, any>): void;
    visitModule(node: ModuleNode, args?: Record<string, any>): void;
    visitImport(node: ImportNode, args?: Record<string, any>): void;
    visitUse(node: UseNode, { frame }: {
        frame: Frame;
    }): void;
    visitFunctionDec(node: FunctionDecNode, { frame }: {
        frame: Frame;
    }): void;
    visitLambda(node: LambdaNode, { frame }: {
        frame: Frame;
    }): void;
    visitBlock(node: BlockNode, { frame }: {
        frame: Frame;
    }): void;
    visitCallExpression(node: CallExpressionNode, { frame }: {
        frame: Frame;
    }): void;
    visitMemberExpression(node: MemberExpressionNode, { frame, args }: {
        frame: Frame;
        args: Type<any>[];
    }): void;
    visitVariableList(node: VariableStatementNode, args?: Record<string, any>): void;
    visitVariable(node: VariableNode, { frame }: {
        frame: Frame;
    }): void;
    visitBinaryOp(node: BinaryOpNode, { frame }: {
        frame: Frame;
    }): void;
    visitScopedIdentifier(node: ScopedIdentifierNode, { frame }: {
        frame: Frame;
    }): void;
    visitReturn(node: ReturnNode, { frame }: {
        frame: Frame;
    }): void;
    visitMap(node: MapNode, { frame }: {
        frame: Frame;
    }): void;
    visitSet(node: SetNode, { frame }: {
        frame: Frame;
    }): void;
    visitArray(node: ArrayNode, { frame }: {
        frame: Frame;
    }): void;
    visitTuple(node: TupleNode, { frame }: {
        frame: Frame;
    }): void;
    visitNumber(node: NumberNode, { frame }: {
        frame: Frame;
    }): void;
    visitString(node: StringNode, { frame }: {
        frame: Frame;
    }): void;
}
//# sourceMappingURL=engine.d.ts.map