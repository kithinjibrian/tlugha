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
    visit(node?: ASTNode, args?: Record<string, any>): Promise<void>;
    after_accept(node: ASTNode, args?: Record<string, any>): void;
    private execute_function;
    run(before_run?: Function[]): Promise<this>;
    call_main(): Promise<any>;
    visitProgram(node: ProgramNode, args?: Record<string, any>): Promise<void>;
    visitSourceElements(node: SourceElementsNode, args?: Record<string, any>): Promise<void>;
    visitExpressionStatement(node: ExpressionStatementNode, args?: Record<string, any>): Promise<void>;
    visitModule(node: ModuleNode, args?: Record<string, any>): Promise<void>;
    visitImport(node: ImportNode, args?: Record<string, any>): Promise<void>;
    visitUse(node: UseNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitFunctionDec(node: FunctionDecNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitLambda(node: LambdaNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitBlock(node: BlockNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitCallExpression(node: CallExpressionNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitMemberExpression(node: MemberExpressionNode, { frame, args }: {
        frame: Frame;
        args: Type<any>[];
    }): Promise<void>;
    visitVariableList(node: VariableStatementNode, args?: Record<string, any>): Promise<void>;
    visitVariable(node: VariableNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitBinaryOp(node: BinaryOpNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitScopedIdentifier(node: ScopedIdentifierNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitReturn(node: ReturnNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitMap(node: MapNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitSet(node: SetNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitArray(node: ArrayNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitTuple(node: TupleNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitNumber(node: NumberNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
    visitString(node: StringNode, { frame }: {
        frame: Frame;
    }): Promise<void>;
}
//# sourceMappingURL=engine.d.ts.map