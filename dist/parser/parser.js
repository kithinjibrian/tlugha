"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const ast_1 = require("./ast");
const token_1 = require("../lexer/token");
class Parser {
    constructor(tokens) {
        this.tokens = [];
        this.current = 0;
        this.tokens = tokens.filter(token => token.type !== token_1.TokenType.Newline);
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    is_at_end() {
        return this.peek() == undefined ||
            this.peek().type === token_1.TokenType.EOF;
    }
    advance() {
        if (!this.is_at_end())
            this.current++;
        return this.previous();
    }
    check(type) {
        if (this.is_at_end())
            return false;
        return this.peek().type === type;
    }
    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    error(message) {
        const token = this.peek();
        throw new Error(`${message} at line ${token.line}, column ${token.column}`);
    }
    /**
     * Program ::= (source_elements)? <EOF>
     */
    parse() {
        let source = this.source_elements();
        if (this.match(token_1.TokenType.EOF)) {
            this.error("Expected 'EOF'");
        }
        return new ast_1.ProgramNode(source);
    }
    /*
        source_elements ::= (source_element)+
    */
    source_elements() {
        const sources = [];
        while (!this.is_at_end()) {
            sources.push(this.source_element());
        }
        return new ast_1.SourceElementsNode(sources);
    }
    /*
        source_element ::= function_declaration
                | statement
    */
    source_element() {
        if (this.peek().type == token_1.TokenType.Fun) {
            return this.function_declaration();
        }
        return this.statement();
    }
    // function_declaration ::= "fun" identifier (type_parameters)? "(" (parameter_list)? ")" type_annotation function_body
    function_declaration() {
        // Expect function name
        if (!this.match(token_1.TokenType.Fun)) {
            this.error("Expected 'fun' keyword name");
        }
        const functionName = this.identifier();
        let tp = undefined;
        if (this.match(token_1.TokenType.LT)) {
            tp = this.type_parameters();
            if (!this.match(token_1.TokenType.GT)) {
                this.error("Expected token '>'");
            }
        }
        // Expect opening parenthesis
        if (!this.match(token_1.TokenType.LeftParen)) {
            this.error("Expected '(' after function name");
        }
        // Parse parameters
        let parameters = this.parameters_list();
        // Expect closing parenthesis
        if (!this.match(token_1.TokenType.RightParen)) {
            this.error("Expected ')' after parameters");
        }
        let rt;
        if (this.match(token_1.TokenType.Colon)) {
            rt = this.type();
        }
        else {
            this.error(`Function '${functionName.name}' requires a return type annotation`);
        }
        return new ast_1.FunctionDecNode(functionName, parameters, this.block(), false, false, false, tp, rt);
    }
    parameters_list() {
        if (this.peek().type == token_1.TokenType.RightParen) {
            return undefined;
        }
        let seen_variadic = false;
        const parameters = [];
        do {
            if (seen_variadic)
                this.error(`Variadic parameter should be the last parameter in a function`);
            const n = this.parameter();
            if (n.variadic)
                seen_variadic = true;
            parameters.push(n);
        } while (this.match(token_1.TokenType.Comma));
        return new ast_1.ParametersListNode(parameters);
    }
    parameter() {
        let variadic = false;
        if (this.match(token_1.TokenType.Ellipsis)) {
            variadic = true;
        }
        const identifier = this.identifier();
        if (!this.match(token_1.TokenType.Colon)) {
            this.error(`Parameter '${identifier.name}' requires type annotation.`);
        }
        const data_type = this.type();
        return new ast_1.ParameterNode(identifier, variadic, data_type);
    }
    /**
     statement ::= block
        | variable_statement
        | import_statement
        | use_statement
        | empty_statement
        | if_statement
        | iteration_statement
        | continue_statement
        | break_statement
        | return_statement
        | expression_statement
        | struct_statement
        | enum_statement
        | trait_statement
        | module_statement
     */
    statement() {
        const iden = this.peek().type;
        switch (iden) {
            case token_1.TokenType.While:
                return this.while_statement();
            case token_1.TokenType.For:
            // return this.for_statement();
            case token_1.TokenType.Return:
                return this.return_statement();
            case token_1.TokenType.Break:
                return this.break_statement();
            case token_1.TokenType.Continue:
                return this.continue_statement();
            case token_1.TokenType.LeftBrace:
                return this.block();
            case token_1.TokenType.If:
                return this.if_statement();
            case token_1.TokenType.Struct:
                return this.struct_statement();
            case token_1.TokenType.Enum:
                return this.enum_statement();
            case token_1.TokenType.Module:
                return this.module_statement();
            case token_1.TokenType.Import:
                return this.import();
            case token_1.TokenType.Use:
                return this.use();
            case token_1.TokenType.Const:
            case token_1.TokenType.Let:
                {
                    const node = this.variable_statement();
                    if (!this.match(token_1.TokenType.SemiColon)) {
                        this.error("Expected ';'");
                    }
                    return node;
                }
        }
        return this.expression_statement();
    }
    // "while" "(" expression ")" statement
    while_statement() {
        if (!this.match(token_1.TokenType.While)) {
            this.error("Expected keyword 'while'");
        }
        // Expect opening parenthesis
        if (!this.match(token_1.TokenType.LeftParen)) {
            this.error("Expected '(' after function name");
        }
        // Parse expression
        let expression = this.expression();
        // Expect closing parenthesis
        if (!this.match(token_1.TokenType.RightParen)) {
            this.error("Expected ')' after parameters");
        }
        const body = this.statement();
        return new ast_1.WhileNode(expression, body);
    }
    /*
        block ::= { statement_list }
        statement_list ::= statement+
    */
    block() {
        const body = [];
        // Expect opening brace
        if (!this.match(token_1.TokenType.LeftBrace)) {
            this.error("Expected '{' before function body");
        }
        while (!this.check(token_1.TokenType.RightBrace) && !this.is_at_end()) {
            body.push(this.statement());
        }
        // Expect closing brace
        if (!this.match(token_1.TokenType.RightBrace)) {
            this.error("Expected '}' before function body");
        }
        return new ast_1.BlockNode(body);
    }
    return_statement() {
        if (!this.match(token_1.TokenType.Return)) {
            this.error("Expected 'return'");
        }
        if (this.match(token_1.TokenType.SemiColon)) {
            return new ast_1.ReturnNode();
        }
        const expression = this.expression();
        if (!this.match(token_1.TokenType.SemiColon)) {
            this.error("Expected ';' after return statement");
        }
        return new ast_1.ReturnNode(expression);
    }
    break_statement() {
        if (!this.match(token_1.TokenType.Break)) {
            this.error("Expected 'break'");
        }
        if (!this.match(token_1.TokenType.SemiColon)) {
            this.error("Expected ';' after break");
        }
        return {
            type: "Break",
            accept(visitor) {
                var _a;
                (_a = visitor.visitBreak) === null || _a === void 0 ? void 0 : _a.call(visitor, this);
            }
        };
    }
    continue_statement() {
        if (!this.match(token_1.TokenType.Continue)) {
            this.error("Expected 'continue'");
        }
        if (!this.match(token_1.TokenType.SemiColon)) {
            this.error("Expected ';' after continue");
        }
        return {
            type: "Continue",
            accept(visitor) {
                var _a;
                (_a = visitor.visitContinue) === null || _a === void 0 ? void 0 : _a.call(visitor, this);
            }
        };
    }
    // "if" "(" expression ")" statement ("else" statement)?
    if_statement() {
        if (!this.match(token_1.TokenType.If)) {
            this.error("Expected keyword 'if'");
        }
        // Expect opening parenthesis
        if (!this.match(token_1.TokenType.LeftParen)) {
            this.error("Expected '(' after function name");
        }
        // Parse condition
        let condition = this.expression();
        // Expect closing parenthesis
        if (!this.match(token_1.TokenType.RightParen)) {
            this.error("Expected ')' after parameters");
        }
        const consequent = this.statement();
        if (this.match(token_1.TokenType.Else)) {
            const alternate = this.statement();
            return new ast_1.IfElseNode(condition, consequent, alternate);
        }
        return new ast_1.IfElseNode(condition, consequent);
    }
    // variable_statement ::= "let" variable_declaration ";"
    // | "const" variable_declaration ";"
    variable_statement() {
        let constant = false;
        if (!this.match(token_1.TokenType.Let)) {
            if (this.match(token_1.TokenType.Const)) {
                constant = true;
            }
            else {
                this.error("Expected 'let'");
            }
        }
        return new ast_1.VariableStatementNode(this.variable(constant));
    }
    // variable_declaration ::= ("mut")? identifier (type_annotation)? (initialiser)?
    variable(constant = false) {
        let mutable = false;
        let expression = undefined;
        if (this.match(token_1.TokenType.Mut)) {
            if (constant) {
                this.error(`Can't mutate const variable '${this.identifier().name}'.`);
            }
            mutable = true;
        }
        let identifier = this.identifier();
        const data_type = this.type_annotation();
        if (this.match(token_1.TokenType.Equals)) {
            expression = this.assignment_expression();
        }
        return new ast_1.VariableNode(identifier, constant, mutable, expression, undefined, data_type);
    }
    // scoped_identifier ::= identifier  ("::" identifier)*
    scoped_identifier() {
        if (!this.match(token_1.TokenType.Identifier)) {
            this.error("Expected an identifer");
        }
        const names = [this.previous().value];
        while (this.match(token_1.TokenType.Scope)) {
            if (!this.match(token_1.TokenType.Identifier)) {
                this.error("Expected an identifer");
            }
            names.push(this.previous().value);
        }
        return new ast_1.ScopedIdentifierNode(names);
    }
    identifier() {
        if (!this.match(token_1.TokenType.Identifier)) {
            this.error("Expected an identifer");
        }
        const name = this.previous().value;
        return new ast_1.IdentifierNode(name);
    }
    /**
        type_parameters ::= "<" type_parameter ("," type_parameter)* ">"
        type_parameter ::= identifier (":" identifier ("," identifier)*)?
     */
    type_parameters() {
        const params = [];
        do {
            if (!this.match(token_1.TokenType.Identifier)) {
                this.error("Expected an identifier.");
            }
            const name = this.previous().value;
            let constraints = [];
            if (this.match(token_1.TokenType.Colon)) {
                do {
                    if (!this.match(token_1.TokenType.Identifier)) {
                        this.error("Expected an identifier");
                    }
                    constraints.push(this.previous().value);
                } while (this.match(token_1.TokenType.Plus));
            }
            params.push(new ast_1.TypeParameterNode(name, constraints));
        } while (this.match(token_1.TokenType.Comma));
        return params;
    }
    // type_annotation ::= ":" type
    type_annotation() {
        if (!this.match(token_1.TokenType.Colon)) {
            return undefined;
        }
        return this.type();
    }
    /**
     *
    type ::= primitive
        | "Self"
        | "Array" "<" type ">"
        | "Set" "<" type ">"
        | "Map" "<" type "," type ">"
        | "(" type ("," type)* ")"
     */
    type() {
        let type = null;
        if ((type = this.array_type())) {
            return type;
        }
        else if ((type = this.set_type())) {
            return type;
        }
        else if ((type = this.map_type())) {
            return type;
        }
        else if ((type = this.primitive())) {
            return type;
        }
        return {
            type: "",
            accept() { }
        };
    }
    /**
     *
     primitive ::= number
        | string
        | bool
        | unit
        | struct_types
     */
    primitive() {
        if (this.match(token_1.TokenType.Identifier)) {
            return new ast_1.TypeNode(this.previous().value);
        }
        return null;
    }
    // "Array" "<" type ">"
    array_type() {
        const value = this.peek().value;
        if (value === "Array") {
            this.advance();
            if (!this.match(token_1.TokenType.LT)) {
                this.error("Expected <");
            }
            const type = this.type();
            if (!this.match(token_1.TokenType.GT)) {
                this.error("Expected >");
            }
            return new ast_1.TypeNode("Array", [type]);
        }
        return null;
    }
    // "Set" "<" type ">"
    set_type() {
        const value = this.peek().value;
        if (value === "Set") {
            this.advance();
            if (!this.match(token_1.TokenType.LT)) {
                this.error("Expected <");
            }
            const type = this.type();
            if (!this.match(token_1.TokenType.GT)) {
                this.error("Expected >");
            }
            return new ast_1.TypeNode("Set", [type]);
        }
        return null;
    }
    // "Map" "<" type "," type ">"
    map_type() {
        const value = this.peek().value;
        if (value === "Map") {
            this.advance();
            if (!this.match(token_1.TokenType.LT)) {
                this.error("Expected <");
            }
            const keyType = this.type();
            if (!this.match(token_1.TokenType.Comma)) {
                this.error("Expected ,");
            }
            const valueType = this.type();
            if (!this.match(token_1.TokenType.GT)) {
                this.error("Expected >");
            }
            return new ast_1.TypeNode("Map", [keyType, valueType]);
        }
        return null;
    }
    // expression_statement::= expression ";"
    expression_statement() {
        const expression = this.expression();
        if (!this.match(token_1.TokenType.SemiColon)) {
            this.error("Expected ';' after expression");
        }
        return new ast_1.ExpressionStatementNode(expression);
    }
    // expression ::= assignment_expression ("," assignment_expression)*
    expression() {
        const expr = this.assignment_expression();
        if (this.match(token_1.TokenType.Comma)) {
            const expressions = [expr];
            do {
                expressions.push(this.assignment_expression());
            } while (this.match(token_1.TokenType.Comma));
            return new ast_1.ExpressionNode(expressions);
        }
        return expr;
    }
    /**
    assignment_expression ::= conditional_expression
        | unary_expression assignment_operator assignment_expression
     */
    assignment_expression() {
        const left = this.conditional_expression();
        if (this.is_assignment_operator(this.peek().type)) {
            const operator = this.advance().value;
            const right = this.assignment_expression();
            if (!this.is_valid_assignment_target(left)) {
                this.error('Invalid assignment target');
            }
            return {
                type: 'AssignmentExpression',
                left,
                operator,
                right,
                accept(visitor, args) {
                    var _a;
                    (_a = visitor.visitAssignmentExpression) === null || _a === void 0 ? void 0 : _a.call(visitor, this, args);
                }
            };
        }
        return left;
    }
    is_assignment_operator(type) {
        return type === token_1.TokenType.Equals ||
            type === token_1.TokenType.PlusEquals ||
            type === token_1.TokenType.MinusEquals ||
            type === token_1.TokenType.MultiplyEquals ||
            type === token_1.TokenType.DivideEquals ||
            type === token_1.TokenType.ModuloEquals ||
            type === token_1.TokenType.SREquals ||
            type === token_1.TokenType.SlEquals ||
            type === token_1.TokenType.AndEquals ||
            type === token_1.TokenType.XorEquals ||
            type === token_1.TokenType.OrEquals;
    }
    is_valid_assignment_target(node) {
        switch (node.type) {
            case 'Identifier':
                return true;
            case 'MemberExpression':
                return true;
            default:
                return false;
        }
    }
    conditional_expression() {
        const condition = this.logical_or_expression();
        if (this.match(token_1.TokenType.QuestionMark)) {
            const consequent = this.expression();
            if (!this.match(token_1.TokenType.Colon)) {
                this.error("Expected ':' in conditional expression");
            }
            const alternate = this.conditional_expression();
            return {
                type: 'TertiaryExpression',
                condition,
                consequent,
                alternate,
                accept(visitor) {
                    var _a;
                    (_a = visitor.visitTertiaryExpression) === null || _a === void 0 ? void 0 : _a.call(visitor, this);
                }
            };
        }
        return condition;
    }
    logical_or_expression() {
        let expr = this.logical_and_expression();
        while (this.match(token_1.TokenType.Or)) {
            const operator = this.previous().value;
            const right = this.logical_and_expression();
            expr = new ast_1.BinaryOpNode(operator, expr, right);
        }
        return expr;
    }
    logical_and_expression() {
        let expr = this.bitwise_or_expression();
        while (this.match(token_1.TokenType.And)) {
            const operator = this.previous().value;
            const right = this.bitwise_or_expression();
            expr = new ast_1.BinaryOpNode(operator, expr, right);
        }
        return expr;
    }
    bitwise_or_expression() {
        let expr = this.bitwise_xor_expression();
        while (this.match(token_1.TokenType.Pipe)) {
            const operator = this.previous().value;
            const right = this.bitwise_xor_expression();
            expr = new ast_1.BinaryOpNode(operator, expr, right);
        }
        return expr;
    }
    bitwise_xor_expression() {
        let expr = this.bitwise_and_expression();
        while (this.match(token_1.TokenType.Caret)) {
            const operator = this.previous().value;
            const right = this.bitwise_and_expression();
            expr = new ast_1.BinaryOpNode(operator, expr, right);
        }
        return expr;
    }
    bitwise_and_expression() {
        let expr = this.equality_expression();
        while (this.match(token_1.TokenType.Ampersand)) {
            const operator = this.previous().value;
            const right = this.equality_expression();
            expr = new ast_1.BinaryOpNode(operator, expr, right);
        }
        return expr;
    }
    equality_expression() {
        let expr = this.relational_expression();
        while (this.is_equality_operator(this.peek().type)) {
            const operator = this.advance().value;
            const right = this.relational_expression();
            expr = new ast_1.BinaryOpNode(operator, expr, right);
        }
        return expr;
    }
    is_equality_operator(type) {
        return type === token_1.TokenType.IsEqual ||
            type === token_1.TokenType.IsNotEqual;
    }
    relational_expression() {
        let expr = this.shift_expression();
        while (this.is_relational_operator(this.peek().type)) {
            const operator = this.advance().value;
            const right = this.shift_expression();
            expr = new ast_1.BinaryOpNode(operator, expr, right);
        }
        return expr;
    }
    is_relational_operator(type) {
        return type === token_1.TokenType.LT ||
            type === token_1.TokenType.LTE ||
            type === token_1.TokenType.GT ||
            type === token_1.TokenType.GTE;
    }
    shift_expression() {
        let expr = this.additive_expression();
        while (this.is_shift_operator(this.peek().type)) {
            const operator = this.advance().value;
            const right = this.additive_expression();
            expr = new ast_1.BinaryOpNode(operator, expr, right);
        }
        return expr;
    }
    is_shift_operator(type) {
        return type === token_1.TokenType.SR || // come back here
            type === token_1.TokenType.SL;
    }
    additive_expression() {
        let expr = this.multiplicative_expression();
        while (this.is_additive_operator(this.peek().type)) {
            const operator = this.advance().value;
            const right = this.multiplicative_expression();
            expr = new ast_1.BinaryOpNode(operator, expr, right);
        }
        return expr;
    }
    is_additive_operator(type) {
        return type === token_1.TokenType.Plus ||
            type === token_1.TokenType.Minus;
    }
    multiplicative_expression() {
        let expr = this.unary_expression();
        while (this.is_multiplicative_operator(this.peek().type)) {
            const operator = this.advance().value;
            const right = this.unary_expression();
            expr = new ast_1.BinaryOpNode(operator, expr, right);
        }
        return expr;
    }
    is_multiplicative_operator(type) {
        return type === token_1.TokenType.Multiply ||
            type === token_1.TokenType.Divide ||
            type === token_1.TokenType.Modulo;
    }
    unary_expression() {
        return this.postfix_expression();
    }
    postfix_expression() {
        let expr = this.primary_expression();
        while (true) {
            if (this.match(token_1.TokenType.LeftBracket)) {
                // Array access: expr[index]
                const index = this.expression();
                if (!this.match(token_1.TokenType.RightBracket)) {
                    this.error("Expected ']' after array index");
                }
                expr = new ast_1.MemberExpressionNode(expr, index, true);
            }
            else if (this.match(token_1.TokenType.LeftParen)) {
                // Function call: expr(args)
                const args = [];
                if (!this.check(token_1.TokenType.RightParen)) {
                    do {
                        args.push(this.assignment_expression());
                    } while (this.match(token_1.TokenType.Comma));
                }
                if (!this.match(token_1.TokenType.RightParen)) {
                    this.error("Expected ')' after function arguments");
                }
                expr = new ast_1.CallExpressionNode(expr, args);
            }
            else if (this.match(token_1.TokenType.Dot)) {
                // Member access: expr.id
                if (!this.match(token_1.TokenType.Identifier)) {
                    this.error("Expected identifier after '.'");
                }
                expr = new ast_1.MemberExpressionNode(expr, new ast_1.IdentifierNode(this.previous().value), false);
            }
            else {
                break;
            }
        }
        return expr;
    }
    primary_expression() {
        switch (this.peek().type) {
            case token_1.TokenType.True:
            case token_1.TokenType.False:
            case token_1.TokenType.Number:
            case token_1.TokenType.String:
                return this.constants();
            case token_1.TokenType.LeftBracket:
                return this.array();
            case token_1.TokenType.LeftBrace:
                return this.map_or_set();
            //case TokenType.Fun:
            //   return this.lambda_function();
            case token_1.TokenType.Identifier: {
                const iden = this.scoped_identifier();
                if (this.peek().type == token_1.TokenType.LeftBrace) {
                    // const object = this.object();
                    // return new StructDefNode(iden.name, object);
                }
                return iden;
            }
            case token_1.TokenType.LeftParen:
                {
                    this.advance();
                    const expr = this.expression();
                    if (!this.match(token_1.TokenType.RightParen)) {
                        this.error("Expected ')' after expression.");
                    }
                    if (expr instanceof ast_1.ExpressionNode) {
                        return new ast_1.TupleNode(expr.expressions);
                    }
                    return expr;
                }
        }
        return this.error('Unknown');
    }
    constants() {
        switch (this.peek().type) {
            case token_1.TokenType.True:
            case token_1.TokenType.False:
                return this.boolean();
            case token_1.TokenType.Number:
                return this.number();
            case token_1.TokenType.String:
                return this.string();
        }
        this.error('Unknown');
    }
    number() {
        if (!this.match(token_1.TokenType.Number)) {
            this.error("Expected a number");
        }
        return new ast_1.NumberNode(+this.previous().value);
    }
    boolean() {
        if (!this.match(token_1.TokenType.True) && !this.match(token_1.TokenType.False)) {
            this.error(`Expected a boolean`);
        }
        return new ast_1.BooleanNode(this.previous().type == token_1.TokenType.True);
    }
    string() {
        if (!this.match(token_1.TokenType.String)) {
            this.error("Expected a string");
        }
        return new ast_1.StringNode(this.previous().value);
    }
    array() {
        const elements = [];
        if (!this.match(token_1.TokenType.LeftBracket)) {
            this.error("Expected a '['");
        }
        if (!this.check(token_1.TokenType.RightBracket)) {
            do {
                elements.push(this.conditional_expression());
            } while (this.match(token_1.TokenType.Comma));
        }
        if (!this.match(token_1.TokenType.RightBracket)) {
            this.error("Expected a ']'");
        }
        return new ast_1.ArrayNode(elements);
    }
    map_or_set() {
        const elements = [];
        const properties = [];
        let is_ds = "none";
        if (!this.match(token_1.TokenType.LeftBrace)) {
            this.error("Expected a '{'");
        }
        if (!this.check(token_1.TokenType.RightBrace)) {
            do {
                let keyExpr = this.assignment_expression();
                if (this.match(token_1.TokenType.Colon)) {
                    if (is_ds == "set") {
                        this.error("Cannot mix key-value pairs and standalone values in a map or set");
                    }
                    is_ds = "map";
                    const valueExpr = this.assignment_expression();
                    if (keyExpr instanceof ast_1.StringNode) {
                        properties.push(new ast_1.PropertyNode(keyExpr.value, valueExpr));
                    }
                    else if (keyExpr instanceof ast_1.ScopedIdentifierNode) {
                        properties.push(new ast_1.PropertyNode(keyExpr.name[0], valueExpr));
                    }
                }
                else {
                    if (is_ds == "map") {
                        this.error("Cannot mix key-value pairs and standalone values in a map or set");
                    }
                    is_ds = "set";
                    elements.push(keyExpr);
                }
            } while (this.match(token_1.TokenType.Comma) && !this.check(token_1.TokenType.RightBrace));
        }
        if (!this.match(token_1.TokenType.RightBrace)) {
            this.error("Expected a '}'");
        }
        return is_ds == "none" ? new ast_1.MapNode([]) : is_ds == "map"
            ? new ast_1.MapNode(properties) : new ast_1.SetNode(elements);
    }
    /**
struct_statement ::= export_modifier? "struct" identifier (type_parameters)? ("impl" trait_impl ("," trait_impl)*)? "{" (struct_body)? "}"
trait_impl ::= identifier (type_arguments)?
type_parameters ::= "<" type_parameter ("," type_parameter)* ">"
type_arguments ::= "<" type ("," type)* ">"
struct_body ::= (struct_member ";")*
struct_member ::= struct_field | struct_method
struct_field ::= ("mut")? identifier type_annotation
struct_method ::= "fun" identifier "(" parameter_list ")" (type_annotation)? function_body
     */
    struct_statement() {
        if (!this.match(token_1.TokenType.Struct)) {
            this.error(`Expected token 'struct'`);
        }
        const name = this.peek().value;
        this.advance();
        let tp = undefined;
        // type_parameters ::= "<" type_parameter ("," type_parameter)* ">"
        if (this.match(token_1.TokenType.LT)) {
            tp = this.type_parameters();
            if (!this.match(token_1.TokenType.GT)) {
                this.error(`Expected token '>'`);
            }
        }
        // ("impl" trait_impl ("," trait_impl)*)?
        if (this.match(token_1.TokenType.Impl)) {
        }
        if (!this.match(token_1.TokenType.LeftBrace)) {
            this.error(`Expected token '{'`);
        }
        let body = this.struct_body();
        if (!this.match(token_1.TokenType.RightBrace)) {
            this.error(`Expected token '}'`);
        }
        if (this.match(token_1.TokenType.SemiColon)) { }
        return new ast_1.StructNode(name, body, false, tp);
    }
    // struct_body ::= (struct_member)*
    struct_body() {
        const fields = [];
        while (!this.check(token_1.TokenType.RightBrace)) {
            if (this.check(token_1.TokenType.Fun)) {
                fields.push(this.function_declaration());
            }
            else {
                fields.push(this.field());
            }
        }
        return fields;
    }
    // struct_field ::= ("mut")? identifier type_annotation ";"
    field() {
        let mutable = false;
        if (this.match(token_1.TokenType.Mut)) {
            mutable = true;
        }
        const identifier = this.identifier();
        let data_type = this.type_annotation();
        if (!this.match(token_1.TokenType.SemiColon)) {
            this.error(`Expected ';' after field declaration`);
        }
        return new ast_1.FieldNode(identifier, mutable, data_type);
    }
    enum_statement() {
        if (!this.match(token_1.TokenType.Enum)) {
            this.error(`Expected token 'enum'`);
        }
        const name = this.peek().value;
        this.advance();
        let tp = undefined;
        if (this.match(token_1.TokenType.LT)) {
            tp = this.type_parameters();
            if (!this.match(token_1.TokenType.GT)) {
                this.error(`Expected token '>'`);
            }
        }
        if (!this.match(token_1.TokenType.LeftBrace)) {
            this.error(`Expected token '{'`);
        }
        let body = this.enum_body();
        if (!this.match(token_1.TokenType.RightBrace)) {
            this.error(`Expected token '}'`);
        }
        if (this.match(token_1.TokenType.SemiColon)) { }
        return new ast_1.EnumNode(name, body, tp);
    }
    enum_body() {
        const variants = [];
        while (!this.check(token_1.TokenType.RightBrace)) {
            if (!this.match(token_1.TokenType.Identifier)) {
                this.error(`Expected an identifier`);
            }
            const name = this.previous().value;
            let value = undefined;
            if (this.match(token_1.TokenType.LeftBrace)) {
                value = new ast_1.StructVariantNode(this.struct_body());
                if (!this.match(token_1.TokenType.RightBrace)) {
                    this.error(`Expected '}' to close struct variant`);
                }
            }
            else if (this.match(token_1.TokenType.LeftParen)) {
                value = new ast_1.TupleVariantNode(this.tuple_payload());
                if (!this.match(token_1.TokenType.RightParen)) {
                    this.error(`Expected ')' to close tuple variant`);
                }
            }
            else if (this.match(token_1.TokenType.Equals)) {
                value = new ast_1.ConstantVariantNode(this.constants());
            }
            variants.push(new ast_1.EnumVariantNode(name, value));
            if (!this.match(token_1.TokenType.Comma)) {
                if (!this.check(token_1.TokenType.RightBrace)) {
                    this.error(`Expected ',' after enum variant`);
                }
            }
        }
        return variants;
    }
    tuple_payload() {
        const types = [];
        do {
            types.push(this.type());
        } while (this.match(token_1.TokenType.Comma));
        return types;
    }
    /*
    module_statement ::= (export_modifier)? "module" identifier "{" (module_body)? "}"
    module_body ::= (module_item)*
    module_item ::= (export_modifier)? source_element
    export_modifier ::= "export"
    */
    module_statement() {
        if (!this.match(token_1.TokenType.Module)) {
            this.error("Expected keyword 'module'");
        }
        let identifer = this.identifier();
        if (!this.match(token_1.TokenType.LeftBrace)) {
            this.error(`Expected token '{'`);
        }
        let body = this.module_body();
        if (!this.match(token_1.TokenType.RightBrace)) {
            this.error(`Expected token '}'`);
        }
        return new ast_1.ModuleNode(identifer, body);
    }
    module_body() {
        const items = [];
        while (!this.check(token_1.TokenType.RightBrace)) {
            let is_public = false;
            if (this.match(token_1.TokenType.Export)) {
                is_public = true;
            }
            const item = this.source_element();
            if (is_public) {
                if (item instanceof ast_1.StructNode ||
                    item instanceof ast_1.FunctionDecNode) {
                    item.exported = true;
                }
                else {
                    this.error(`Node '${item.type}' can't be exported`);
                }
            }
            items.push(item);
        }
        return items;
    }
    // import_statement ::= "import" identifier ";"
    import() {
        if (!this.match(token_1.TokenType.Import)) {
            this.error("Expected keyword 'import'");
        }
        let identifer = this.identifier();
        if (!this.match(token_1.TokenType.SemiColon)) {
            this.error("Expected ';'");
        }
        return new ast_1.ImportNode(identifer);
    }
    /*
    use_statement ::= "use" use_path ("as" identifier)? ";"
        | "use" use_path "{" use_list "}"";"
    use_path ::= identifier ("::" identifier)*
    use_list ::= use_item ("," use_item)*
    use_item ::= identifier ("as" identifier)?
        | "*"
    */
    use() {
        if (!this.match(token_1.TokenType.Use)) {
            this.error("Expected keyword 'use'");
        }
        let path = this.use_path();
        let list = undefined, alias = undefined;
        if (this.match(token_1.TokenType.LeftBrace)) {
            list = this.use_list();
            if (!this.match(token_1.TokenType.RightBrace)) {
                this.error("Expected token '}'");
            }
        }
        else if (this.match(token_1.TokenType.As)) {
            if (!this.match(token_1.TokenType.Identifier)) {
                this.error("Expected an identifier");
            }
            alias = this.previous().value;
        }
        if (!this.match(token_1.TokenType.SemiColon)) {
            this.error("Expected ';'");
        }
        return new ast_1.UseNode(path, list, alias);
    }
    use_path() {
        const path = [];
        do {
            if (this.check(token_1.TokenType.LeftBrace))
                break;
            if (!this.match(token_1.TokenType.Identifier)) {
                this.error("Expected an identifer");
            }
            path.push(this.previous().value);
        } while (this.match(token_1.TokenType.Scope));
        return new ast_1.UsePathNode(path);
    }
    use_list() {
        const items = [];
        do {
            items.push(this.use_item());
        } while (this.match(token_1.TokenType.Comma));
        return new ast_1.UseListNode(items);
    }
    use_item() {
        if (!this.match(token_1.TokenType.Identifier)) {
            this.error("Expected an identifer");
        }
        let name = this.previous().value;
        let alias = undefined;
        if (this.match(token_1.TokenType.As)) {
            if (!this.match(token_1.TokenType.Identifier)) {
                this.error("Expected an identifer");
            }
            alias = this.previous().value;
        }
        return new ast_1.UseItemNode(name, alias);
    }
}
exports.Parser = Parser;
