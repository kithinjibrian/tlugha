export interface ASTVisitor {
    before_accept?(node: ASTNode, args?: Record<string, any>): any;
    after_accept?(node: ASTNode, args?: Record<string, any>): any;
    visitNumber?(node: NumberNode, args?: Record<string, any>): any;
    visitBoolean?(node: BooleanNode, args?: Record<string, any>): any;
    visitString?(node: StringNode, args?: Record<string, any>): any;
    visitNull?(node: NullNode, args?: Record<string, any>): any;
    visitProgram?(node: ProgramNode, args?: Record<string, any>): any;
    visitSourceElements?(node: SourceElementsNode, args?: Record<string, any>): any;
    visitBlock?(node: BlockNode, args?: Record<string, any>): any;
    visitWhile?(node: WhileNode, args?: Record<string, any>): any;
    visitFor?(node: ForNode, args?: Record<string, any>): any;
    visitFunctionDec?(node: FunctionDecNode, args?: Record<string, any>): any;
    visitLambda?(node: LambdaNode, args?: Record<string, any>): any;
    visitContinuation?(node: ContinuationNode, args?: Record<string, any>): any;
    visitParametersList?(node: ParametersListNode, args?: Record<string, any>): any;
    visitParameter?(node: ParameterNode, args?: Record<string, any>): any;
    visitReturn?(node: ReturnNode, args?: Record<string, any>): any;
    visitBreak?(node: ASTNode, args?: Record<string, any>): any;
    visitContinue?(node: ASTNode, args?: Record<string, any>): any;
    visitVariableList?(node: VariableStatementNode, args?: Record<string, any>): any;
    visitVariable?(node: VariableNode, args?: Record<string, any>): any;
    visitExpressionStatement?(node: ExpressionStatementNode, args?: Record<string, any>): any;
    visitAssignmentExpression?(node: BinaryOpNode, args?: Record<string, any>): any;
    visitTertiaryExpression?(node: ASTNode, args?: Record<string, any>): any;
    visitExpression?(node: ExpressionNode, args?: Record<string, any>): any;
    visitArray?(node: ArrayNode, args?: Record<string, any>): any;
    visitMap?(node: MapNode, args?: Record<string, any>): any;
    visitSet?(node: SetNode, args?: Record<string, any>): any;
    visitTuple?(node: TupleNode, args?: Record<string, any>): any;
    visitStructDef?(node: StructDefNode, args?: Record<string, any>): any;
    visitProperty?(node: PropertyNode, args?: Record<string, any>): any;
    visitBinaryOp?(node: BinaryOpNode, args?: Record<string, any>): any;
    visitTertiaryExpression?(node: TertiaryExpressionNode, args?: Record<string, any>): any;
    visitIfElse?(node: IfElseNode, args?: Record<string, any>): any;
    visitUnaryOp?(node: UnaryOpNode, args?: Record<string, any>): any;
    visitMemberExpression?(node: MemberExpressionNode, args?: Record<string, any>): any;
    visitAwaitExpression?(node: AwaitExpressionNode, args?: Record<string, any>): any;
    visitCallExpression?(node: CallExpressionNode, args?: Record<string, any>): any;
    visitArrowExpression?(node: ArrowExpressionNode, args?: Record<string, any>): any;
    visitPostfixExpression?(node: PostfixExpressionNode, args?: Record<string, any>): any;
    visitIdentifier?(node: IdentifierNode, args?: Record<string, any>): any;
    visitScopedIdentifier?(node: ScopedIdentifierNode, args?: Record<string, any>): any;
    visitType?(node: TypeNode, args?: Record<string, any>): any;
    visitAssignment?(node: AssignmentNode, args?: Record<string, any>): any;
    visitTypeParameter?(node: TypeParameterNode, args?: Record<string, any>): any;
    visitGenericType?(node: GenericTypeNode, args?: Record<string, any>): any;
    visitStruct?(node: StructNode, args?: Record<string, any>): any;
    visitField?(node: FieldNode, args?: Record<string, any>): any;
    visitEnum?(node: EnumNode, args?: Record<string, any>): any;
    visitEnumVariant?(node: EnumVariantNode, args?: Record<string, any>): any;
    visitStructVariant?(node: StructVariantNode, args?: Record<string, any>): any;
    visitTupleVariant?(node: TupleVariantNode, args?: Record<string, any>): any;
    visitConstantVariant?(node: ConstantVariantNode, args?: Record<string, any>): any;
    visitModule?(node: ModuleNode, args?: Record<string, any>): any;
    visitImport?(node: ImportNode, args?: Record<string, any>): any;
    visitUse?(node: UseNode, args?: Record<string, any>): any;
    visitUsePath?(node: UsePathNode, args?: Record<string, any>): any;
    visitUseList?(node: UseListNode, args?: Record<string, any>): any;
    visitUseItem?(node: UseItemNode, args?: Record<string, any>): any;
}
export interface ASTNode {
    type: string;
    accept(visitor: ASTVisitor, args?: Record<string, any>): any;
}
export declare abstract class ASTNodeBase implements ASTNode {
    abstract type: string;
    accept(visitor: ASTVisitor, args?: Record<string, any>): void;
    abstract _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ProgramNode extends ASTNodeBase {
    program: ASTNode;
    type: string;
    constructor(program: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class SourceElementsNode extends ASTNodeBase {
    sources: ASTNode[];
    type: string;
    constructor(sources: ASTNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class BlockNode extends ASTNodeBase {
    body: ASTNode[];
    type: string;
    constructor(body: ASTNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class WhileNode extends ASTNodeBase {
    expression: ASTNode;
    body: ASTNode;
    type: string;
    constructor(expression: ASTNode, body: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ForNode extends ASTNodeBase {
    init: ASTNode | undefined;
    condition: ASTNode | undefined;
    update: ASTNode | undefined;
    body: ASTNode;
    type: string;
    constructor(init: ASTNode | undefined, condition: ASTNode | undefined, update: ASTNode | undefined, body: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ContinuationNode extends ASTNodeBase {
    params: any[];
    body: ASTNode;
    type: string;
    constructor(params: any[], body: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class FunctionDecNode extends ASTNodeBase {
    identifier: IdentifierNode;
    params: ParametersListNode | undefined;
    body: BlockNode;
    inbuilt: boolean;
    is_async: boolean;
    exported: boolean;
    type_parameters?: TypeParameterNode[] | undefined;
    return_type?: ASTNode | undefined;
    type: string;
    constructor(identifier: IdentifierNode, params: ParametersListNode | undefined, body: BlockNode, inbuilt?: boolean, is_async?: boolean, exported?: boolean, type_parameters?: TypeParameterNode[] | undefined, return_type?: ASTNode | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class LambdaNode extends ASTNodeBase {
    params: ParametersListNode | undefined;
    body: ASTNode;
    is_async: boolean;
    type_parameters?: TypeParameterNode[] | undefined;
    return_type?: ASTNode | undefined;
    type: string;
    constructor(params: ParametersListNode | undefined, body: ASTNode, is_async?: boolean, type_parameters?: TypeParameterNode[] | undefined, return_type?: ASTNode | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ParametersListNode extends ASTNodeBase {
    parameters: ParameterNode[];
    type: string;
    constructor(parameters: ParameterNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ParameterNode extends ASTNodeBase {
    identifier: IdentifierNode;
    variadic: boolean;
    data_type: ASTNode;
    expression?: ASTNode | undefined;
    value?: any | undefined;
    type: string;
    constructor(identifier: IdentifierNode, variadic: boolean, data_type: ASTNode, expression?: ASTNode | undefined, value?: any | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ReturnNode extends ASTNodeBase {
    expression?: ASTNode | undefined;
    type: string;
    constructor(expression?: ASTNode | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class VariableStatementNode extends ASTNodeBase {
    variables: VariableNode;
    type: string;
    constructor(variables: VariableNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class VariableNode extends ASTNodeBase {
    identifier: IdentifierNode;
    constant: boolean;
    mutable: boolean;
    expression?: ASTNode | undefined;
    value?: any | undefined;
    data_type?: any | undefined;
    type: string;
    constructor(identifier: IdentifierNode, constant: boolean, mutable: boolean, expression?: ASTNode | undefined, value?: any | undefined, data_type?: any | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ExpressionStatementNode extends ASTNodeBase {
    expression: ASTNode;
    type: string;
    constructor(expression: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ExpressionNode extends ASTNodeBase {
    expressions: ASTNode[];
    type: string;
    constructor(expressions: ASTNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class NumberNode extends ASTNodeBase {
    value: number;
    type: string;
    constructor(value: number);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class BooleanNode extends ASTNodeBase {
    value: boolean;
    type: string;
    constructor(value: boolean);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class StringNode extends ASTNodeBase {
    value: string;
    type: string;
    constructor(value: string);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class NullNode extends ASTNodeBase {
    value: string;
    type: string;
    constructor(value?: string);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ArrayNode extends ASTNodeBase {
    elements: ASTNode[];
    type: string;
    constructor(elements: ASTNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class MapNode extends ASTNodeBase {
    properties: PropertyNode[];
    type: string;
    constructor(properties: PropertyNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class SetNode extends ASTNodeBase {
    values: ASTNode[];
    type: string;
    constructor(values: ASTNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class TupleNode extends ASTNodeBase {
    values: ASTNode[];
    type: string;
    constructor(values: ASTNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class StructDefNode extends ASTNodeBase {
    name: string;
    object: MapNode;
    exported: boolean;
    type: string;
    constructor(name: string, object: MapNode, exported?: boolean);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class PropertyNode extends ASTNodeBase {
    key: string;
    value: ASTNode;
    type: string;
    constructor(key: string, value: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class BinaryOpNode extends ASTNodeBase {
    operator: string;
    left: ASTNode;
    right: ASTNode;
    type: string;
    constructor(operator: string, left: ASTNode, right: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class TertiaryExpressionNode extends ASTNodeBase {
    condition: ASTNode;
    consequent: ASTNode;
    alternate: ASTNode;
    type: string;
    constructor(condition: ASTNode, consequent: ASTNode, alternate: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class IfElseNode extends ASTNodeBase {
    condition: ASTNode;
    consequent: ASTNode;
    alternate?: ASTNode | undefined;
    type: string;
    constructor(condition: ASTNode, consequent: ASTNode, alternate?: ASTNode | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class UnaryOpNode extends ASTNodeBase {
    operator: string;
    operand: ASTNode;
    type: string;
    constructor(operator: string, operand: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class MemberExpressionNode extends ASTNodeBase {
    object: ASTNode;
    property: ASTNode;
    computed: boolean;
    type: string;
    constructor(object: ASTNode, property: ASTNode, computed: boolean);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class AwaitExpressionNode extends ASTNodeBase {
    expression: ASTNode;
    type: string;
    constructor(expression: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class CallExpressionNode extends ASTNodeBase {
    callee: ASTNode;
    args: ASTNode[];
    type: string;
    constructor(callee: ASTNode, args: ASTNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ArrowExpressionNode extends ASTNodeBase {
    params: ASTNode;
    body: ASTNode;
    type: string;
    constructor(params: ASTNode, body: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class PostfixExpressionNode extends ASTNodeBase {
    operator: string;
    argument: ASTNode;
    prefix: boolean;
    type: string;
    constructor(operator: string, argument: ASTNode, prefix: boolean);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class IdentifierNode extends ASTNodeBase {
    name: string;
    type: string;
    constructor(name: string);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ScopedIdentifierNode extends ASTNodeBase {
    name: string[];
    type: string;
    constructor(name: string[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class TypeParameterNode extends ASTNodeBase {
    name: string;
    constraints: string[];
    type: string;
    constructor(name: string, constraints?: string[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class TypeNode extends ASTNodeBase {
    name: string;
    types?: any[] | undefined;
    type: string;
    constructor(name: string, types?: any[] | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class GenericTypeNode extends ASTNodeBase {
    type_parameters: TypeParameterNode[];
    base_type: ASTNode;
    type: string;
    constructor(type_parameters: TypeParameterNode[], base_type: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class AssignmentNode extends ASTNodeBase {
    variable: IdentifierNode;
    value: ASTNode;
    type: string;
    constructor(variable: IdentifierNode, value: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class StructNode extends ASTNodeBase {
    name: string;
    body: ASTNode[];
    exported: boolean;
    type_parameters?: TypeParameterNode[] | undefined;
    type: string;
    constructor(name: string, body: ASTNode[], exported?: boolean, type_parameters?: TypeParameterNode[] | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class FieldNode extends ASTNodeBase {
    field: IdentifierNode;
    mutable: boolean;
    data_type?: ASTNode | undefined;
    type: string;
    constructor(field: IdentifierNode, mutable: boolean, data_type?: ASTNode | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class EnumNode extends ASTNodeBase {
    name: string;
    body: EnumVariantNode[];
    type_parameters?: TypeParameterNode[] | undefined;
    type: string;
    constructor(name: string, body: EnumVariantNode[], type_parameters?: TypeParameterNode[] | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export type EnumVariantValueNode = StructVariantNode | TupleVariantNode | ConstantVariantNode;
export declare class EnumVariantNode extends ASTNodeBase {
    name: string;
    value?: EnumVariantValueNode | undefined;
    type: string;
    constructor(name: string, value?: EnumVariantValueNode | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class StructVariantNode extends ASTNodeBase {
    fields: ASTNode[];
    type: string;
    constructor(fields: ASTNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class TupleVariantNode extends ASTNodeBase {
    types: ASTNode[];
    type: string;
    constructor(types: ASTNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ConstantVariantNode extends ASTNodeBase {
    types: ASTNode;
    type: string;
    constructor(types: ASTNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ModuleNode extends ASTNodeBase {
    identifier: IdentifierNode;
    body: ASTNode[];
    type: string;
    constructor(identifier: IdentifierNode, body: ASTNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class ImportNode extends ASTNodeBase {
    identifier: IdentifierNode;
    type: string;
    constructor(identifier: IdentifierNode);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class UseNode extends ASTNodeBase {
    path: UsePathNode;
    list?: UseListNode | undefined;
    alias?: string | undefined;
    type: string;
    constructor(path: UsePathNode, list?: UseListNode | undefined, alias?: string | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class UsePathNode extends ASTNodeBase {
    path: string[];
    type: string;
    constructor(path: string[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class UseListNode extends ASTNodeBase {
    items: UseItemNode[];
    type: string;
    constructor(items: UseItemNode[]);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
export declare class UseItemNode extends ASTNodeBase {
    name: string;
    alias?: string | undefined;
    type: string;
    constructor(name: string, alias?: string | undefined);
    _accept(visitor: ASTVisitor, args?: Record<string, any>): void;
}
//# sourceMappingURL=ast.d.ts.map