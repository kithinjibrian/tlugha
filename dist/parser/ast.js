"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportNode = exports.ModuleNode = exports.ConstantVariantNode = exports.TupleVariantNode = exports.StructVariantNode = exports.EnumVariantNode = exports.EnumNode = exports.FieldNode = exports.StructNode = exports.AssignmentNode = exports.GenericTypeNode = exports.TypeNode = exports.TypeParameterNode = exports.ScopedIdentifierNode = exports.IdentifierNode = exports.PostfixExpressionNode = exports.ArrowExpressionNode = exports.CallExpressionNode = exports.AwaitExpressionNode = exports.MemberExpressionNode = exports.UnaryOpNode = exports.IfElseNode = exports.TertiaryExpressionNode = exports.BinaryOpNode = exports.PropertyNode = exports.StructDefNode = exports.TupleNode = exports.SetNode = exports.MapNode = exports.ArrayNode = exports.NullNode = exports.StringNode = exports.BooleanNode = exports.NumberNode = exports.ExpressionNode = exports.ExpressionStatementNode = exports.VariableNode = exports.VariableStatementNode = exports.ReturnNode = exports.ParameterNode = exports.ParametersListNode = exports.LambdaNode = exports.FunctionDecNode = exports.ContinuationNode = exports.ForNode = exports.WhileNode = exports.BlockNode = exports.SourceElementsNode = exports.ProgramNode = exports.ASTNodeBase = void 0;
exports.UseItemNode = exports.UseListNode = exports.UsePathNode = exports.UseNode = void 0;
class ASTNodeBase {
    accept(visitor, args) {
        var _a, _b;
        (_a = visitor.before_accept) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
        const res = this._accept(visitor, args);
        (_b = visitor.after_accept) === null || _b === void 0 ? void 0 : _b.call(visitor, this, args);
        return res;
    }
}
exports.ASTNodeBase = ASTNodeBase;
class ProgramNode extends ASTNodeBase {
    constructor(program) {
        super();
        this.program = program;
        this.type = 'ProgramNode';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitProgram) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ProgramNode = ProgramNode;
class SourceElementsNode extends ASTNodeBase {
    constructor(sources) {
        super();
        this.sources = sources;
        this.type = 'SourceElements';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitSourceElements) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.SourceElementsNode = SourceElementsNode;
class BlockNode extends ASTNodeBase {
    constructor(body) {
        super();
        this.body = body;
        this.type = 'Block';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitBlock) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.BlockNode = BlockNode;
class WhileNode extends ASTNodeBase {
    constructor(expression, body) {
        super();
        this.expression = expression;
        this.body = body;
        this.type = 'While';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitWhile) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.WhileNode = WhileNode;
class ForNode extends ASTNodeBase {
    constructor(init, condition, update, body) {
        super();
        this.init = init;
        this.condition = condition;
        this.update = update;
        this.body = body;
        this.type = 'For';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitFor) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ForNode = ForNode;
class ContinuationNode extends ASTNodeBase {
    constructor(params, body) {
        super();
        this.params = params;
        this.body = body;
        this.type = "Continuation";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitContinuation) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ContinuationNode = ContinuationNode;
class FunctionDecNode extends ASTNodeBase {
    constructor(identifier, params, body, inbuilt = false, is_async = false, exported = false, type_parameters, return_type) {
        super();
        this.identifier = identifier;
        this.params = params;
        this.body = body;
        this.inbuilt = inbuilt;
        this.is_async = is_async;
        this.exported = exported;
        this.type_parameters = type_parameters;
        this.return_type = return_type;
        this.type = 'FunctionDec';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitFunctionDec) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.FunctionDecNode = FunctionDecNode;
class LambdaNode extends ASTNodeBase {
    constructor(params, body, is_async = false, type_parameters, return_type) {
        super();
        this.params = params;
        this.body = body;
        this.is_async = is_async;
        this.type_parameters = type_parameters;
        this.return_type = return_type;
        this.type = 'Lambda';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitLambda) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.LambdaNode = LambdaNode;
class ParametersListNode extends ASTNodeBase {
    constructor(parameters) {
        super();
        this.parameters = parameters;
        this.type = 'ParametersList';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitParametersList) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ParametersListNode = ParametersListNode;
class ParameterNode extends ASTNodeBase {
    constructor(identifier, variadic, data_type, expression, value) {
        super();
        this.identifier = identifier;
        this.variadic = variadic;
        this.data_type = data_type;
        this.expression = expression;
        this.value = value;
        this.type = 'Parameter';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitParameter) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ParameterNode = ParameterNode;
class ReturnNode extends ASTNodeBase {
    constructor(expression) {
        super();
        this.expression = expression;
        this.type = 'Return';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitReturn) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ReturnNode = ReturnNode;
class VariableStatementNode extends ASTNodeBase {
    constructor(variables) {
        super();
        this.variables = variables;
        this.type = 'Let';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitVariableList) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.VariableStatementNode = VariableStatementNode;
class VariableNode extends ASTNodeBase {
    constructor(identifier, constant, mutable, expression, value, data_type) {
        super();
        this.identifier = identifier;
        this.constant = constant;
        this.mutable = mutable;
        this.expression = expression;
        this.value = value;
        this.data_type = data_type;
        this.type = 'Variable';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitVariable) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.VariableNode = VariableNode;
class ExpressionStatementNode extends ASTNodeBase {
    constructor(expression) {
        super();
        this.expression = expression;
        this.type = 'ExpressionStatement';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitExpressionStatement) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ExpressionStatementNode = ExpressionStatementNode;
class ExpressionNode extends ASTNodeBase {
    constructor(expressions) {
        super();
        this.expressions = expressions;
        this.type = 'Expression';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitExpression) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ExpressionNode = ExpressionNode;
class NumberNode extends ASTNodeBase {
    constructor(value) {
        super();
        this.value = value;
        this.type = 'Number';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitNumber) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.NumberNode = NumberNode;
class BooleanNode extends ASTNodeBase {
    constructor(value) {
        super();
        this.value = value;
        this.type = 'Boolean';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitBoolean) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.BooleanNode = BooleanNode;
class StringNode extends ASTNodeBase {
    constructor(value) {
        super();
        this.value = value;
        this.type = 'String';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitString) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.StringNode = StringNode;
class NullNode extends ASTNodeBase {
    constructor(value = "null") {
        super();
        this.value = value;
        this.type = 'Null';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitNull) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.NullNode = NullNode;
class ArrayNode extends ASTNodeBase {
    constructor(elements) {
        super();
        this.elements = elements;
        this.type = 'Array';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitArray) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ArrayNode = ArrayNode;
class MapNode extends ASTNodeBase {
    constructor(properties) {
        super();
        this.properties = properties;
        this.type = 'Map';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitMap) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.MapNode = MapNode;
class SetNode extends ASTNodeBase {
    constructor(values) {
        super();
        this.values = values;
        this.type = 'Set';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitSet) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.SetNode = SetNode;
class TupleNode extends ASTNodeBase {
    constructor(values) {
        super();
        this.values = values;
        this.type = 'Tuple';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitTuple) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.TupleNode = TupleNode;
class StructDefNode extends ASTNodeBase {
    constructor(name, object, exported = false) {
        super();
        this.name = name;
        this.object = object;
        this.exported = exported;
        this.type = 'StructDef';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitStructDef) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.StructDefNode = StructDefNode;
class PropertyNode extends ASTNodeBase {
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
        this.type = 'Property';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitProperty) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.PropertyNode = PropertyNode;
class BinaryOpNode extends ASTNodeBase {
    constructor(operator, left, right) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
        this.type = 'BinaryExpression';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitBinaryOp) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.BinaryOpNode = BinaryOpNode;
class TertiaryExpressionNode extends ASTNodeBase {
    constructor(condition, consequent, alternate) {
        super();
        this.condition = condition;
        this.consequent = consequent;
        this.alternate = alternate;
        this.type = 'TertiaryExpression';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitTertiaryExpression) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.TertiaryExpressionNode = TertiaryExpressionNode;
class IfElseNode extends ASTNodeBase {
    constructor(condition, consequent, alternate) {
        super();
        this.condition = condition;
        this.consequent = consequent;
        this.alternate = alternate;
        this.type = 'IfElse';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitIfElse) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.IfElseNode = IfElseNode;
class UnaryOpNode extends ASTNodeBase {
    constructor(operator, operand) {
        super();
        this.operator = operator;
        this.operand = operand;
        this.type = 'UnaryOp';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitUnaryOp) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.UnaryOpNode = UnaryOpNode;
class MemberExpressionNode extends ASTNodeBase {
    constructor(object, property, computed) {
        super();
        this.object = object;
        this.property = property;
        this.computed = computed;
        this.type = 'MemberExpression';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitMemberExpression) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.MemberExpressionNode = MemberExpressionNode;
class AwaitExpressionNode extends ASTNodeBase {
    constructor(expression) {
        super();
        this.expression = expression;
        this.type = 'AwaitExpression';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitAwaitExpression) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.AwaitExpressionNode = AwaitExpressionNode;
class CallExpressionNode extends ASTNodeBase {
    constructor(callee, args) {
        super();
        this.callee = callee;
        this.args = args;
        this.type = 'CallExpression';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitCallExpression) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.CallExpressionNode = CallExpressionNode;
class ArrowExpressionNode extends ASTNodeBase {
    constructor(params, body) {
        super();
        this.params = params;
        this.body = body;
        this.type = 'ArrowExpression';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitArrowExpression) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ArrowExpressionNode = ArrowExpressionNode;
class PostfixExpressionNode extends ASTNodeBase {
    constructor(operator, argument, prefix) {
        super();
        this.operator = operator;
        this.argument = argument;
        this.prefix = prefix;
        this.type = 'PostfixExpression';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitPostfixExpression) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.PostfixExpressionNode = PostfixExpressionNode;
class IdentifierNode extends ASTNodeBase {
    constructor(name) {
        super();
        this.name = name;
        this.type = 'Identifier';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitIdentifier) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.IdentifierNode = IdentifierNode;
class ScopedIdentifierNode extends ASTNodeBase {
    constructor(name) {
        super();
        this.name = name;
        this.type = 'ScopedIdentifier';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitScopedIdentifier) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ScopedIdentifierNode = ScopedIdentifierNode;
class TypeParameterNode extends ASTNodeBase {
    constructor(name, constraints = []) {
        super();
        this.name = name;
        this.constraints = constraints;
        this.type = "TypeParameter";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitTypeParameter) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.TypeParameterNode = TypeParameterNode;
class TypeNode extends ASTNodeBase {
    constructor(name, types) {
        super();
        this.name = name;
        this.types = types;
        this.type = "Type";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitType) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.TypeNode = TypeNode;
class GenericTypeNode extends ASTNodeBase {
    constructor(type_parameters, base_type) {
        super();
        this.type_parameters = type_parameters;
        this.base_type = base_type;
        this.type = "GenericType";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitGenericType) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.GenericTypeNode = GenericTypeNode;
class AssignmentNode extends ASTNodeBase {
    constructor(variable, value) {
        super();
        this.variable = variable;
        this.value = value;
        this.type = 'Assignment';
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitAssignment) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.AssignmentNode = AssignmentNode;
class StructNode extends ASTNodeBase {
    constructor(name, body, exported = false, type_parameters) {
        super();
        this.name = name;
        this.body = body;
        this.exported = exported;
        this.type_parameters = type_parameters;
        this.type = "Struct";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitStruct) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.StructNode = StructNode;
class FieldNode extends ASTNodeBase {
    constructor(field, mutable, data_type) {
        super();
        this.field = field;
        this.mutable = mutable;
        this.data_type = data_type;
        this.type = "Field";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitField) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.FieldNode = FieldNode;
class EnumNode extends ASTNodeBase {
    constructor(name, body, type_parameters) {
        super();
        this.name = name;
        this.body = body;
        this.type_parameters = type_parameters;
        this.type = "Enum";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitEnum) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.EnumNode = EnumNode;
class EnumVariantNode extends ASTNodeBase {
    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
        this.type = "EnumVariant";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitEnumVariant) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.EnumVariantNode = EnumVariantNode;
class StructVariantNode extends ASTNodeBase {
    constructor(fields) {
        super();
        this.fields = fields;
        this.type = "StructVariant";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitStructVariant) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.StructVariantNode = StructVariantNode;
class TupleVariantNode extends ASTNodeBase {
    constructor(types) {
        super();
        this.types = types;
        this.type = "TupleVariant";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitTupleVariant) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.TupleVariantNode = TupleVariantNode;
class ConstantVariantNode extends ASTNodeBase {
    constructor(types) {
        super();
        this.types = types;
        this.type = "ConstantVariant";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitConstantVariant) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ConstantVariantNode = ConstantVariantNode;
class ModuleNode extends ASTNodeBase {
    constructor(identifier, body) {
        super();
        this.identifier = identifier;
        this.body = body;
        this.type = "Module";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitModule) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ModuleNode = ModuleNode;
class ImportNode extends ASTNodeBase {
    constructor(identifier) {
        super();
        this.identifier = identifier;
        this.type = "Import";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitImport) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.ImportNode = ImportNode;
class UseNode extends ASTNodeBase {
    constructor(path, list, alias) {
        super();
        this.path = path;
        this.list = list;
        this.alias = alias;
        this.type = "Use";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitUse) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.UseNode = UseNode;
class UsePathNode extends ASTNodeBase {
    constructor(path) {
        super();
        this.path = path;
        this.type = "UsePath";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitUsePath) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.UsePathNode = UsePathNode;
class UseListNode extends ASTNodeBase {
    constructor(items) {
        super();
        this.items = items;
        this.type = "UseList";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitUseList) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.UseListNode = UseListNode;
class UseItemNode extends ASTNodeBase {
    constructor(name, alias) {
        super();
        this.name = name;
        this.alias = alias;
        this.type = "UseItem";
    }
    _accept(visitor, args) {
        var _a;
        return (_a = visitor.visitUseItem) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
    }
}
exports.UseItemNode = UseItemNode;
