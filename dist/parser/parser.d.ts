import { ASTNode } from "./ast";
import { Token } from "../lexer/lexer";
export declare class Parser {
    private tokens;
    private current;
    constructor(tokens: Token[]);
    private peek;
    private previous;
    private is_at_end;
    private advance;
    private check;
    private match;
    private error;
    /**
     * Program ::= (source_elements)? <EOF>
     */
    parse(): ASTNode;
    private source_elements;
    private source_element;
    private function_declaration;
    private parameters_list;
    private parameter;
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
    private statement;
    private while_statement;
    private block;
    private return_statement;
    private break_statement;
    private continue_statement;
    private if_statement;
    private variable_statement;
    private variable;
    private scoped_identifier;
    private identifier;
    /**
        type_parameters ::= "<" type_parameter ("," type_parameter)* ">"
        type_parameter ::= identifier (":" identifier ("," identifier)*)?
     */
    private type_parameters;
    private type_annotation;
    /**
     *
    type ::= primitive
        | "Self"
        | "Array" "<" type ">"
        | "Set" "<" type ">"
        | "Map" "<" type "," type ">"
        | "(" type ("," type)* ")"
     */
    type(): ASTNode;
    /**
     *
     primitive ::= number
        | string
        | bool
        | unit
        | struct_types
     */
    private primitive;
    private array_type;
    private set_type;
    private map_type;
    private expression_statement;
    private expression;
    /**
    assignment_expression ::= conditional_expression
        | unary_expression assignment_operator assignment_expression
     */
    private assignment_expression;
    private is_assignment_operator;
    private is_valid_assignment_target;
    private conditional_expression;
    private logical_or_expression;
    private logical_and_expression;
    private bitwise_or_expression;
    private bitwise_xor_expression;
    private bitwise_and_expression;
    private equality_expression;
    private is_equality_operator;
    private relational_expression;
    private is_relational_operator;
    private shift_expression;
    private is_shift_operator;
    private additive_expression;
    private is_additive_operator;
    private multiplicative_expression;
    private is_multiplicative_operator;
    private unary_expression;
    private postfix_expression;
    private primary_expression;
    private constants;
    private number;
    private boolean;
    private string;
    private array;
    private map_or_set;
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
    private struct_statement;
    private struct_body;
    private field;
    private enum_statement;
    private enum_body;
    private tuple_payload;
    private module_statement;
    private module_body;
    private import;
    private use;
    private use_path;
    private use_list;
    private use_item;
}
//# sourceMappingURL=parser.d.ts.map