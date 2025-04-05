"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberType = void 0;
const types_1 = require("../types");
const base_1 = require("./base");
const bool_1 = require("./bool");
const function_1 = require("./function");
let m = {
    sqrt(value) {
        return Math.sqrt(value);
    },
    abs(value) {
        return Math.abs(value);
    },
    ceil(value) {
        return Math.ceil(value);
    },
    floor(value) {
        return Math.floor(value);
    },
    round(value) {
        return Math.round(value);
    },
    trunc(value) {
        return Math.trunc(value);
    },
    pow(value, args) {
        return Math.pow(value, args[0]);
    },
};
class NumberType extends base_1.Type {
    constructor(value) {
        super("number", value, {
            add: (obj) => new NumberType(value + obj.getValue()),
            minus: (obj) => new NumberType(value - obj.getValue()),
            multiply: (obj) => new NumberType(value * obj.getValue()),
            divide: (obj) => {
                const divisor = obj.getValue();
                if (divisor === 0)
                    throw new Error("Cannot divide by zero");
                return new NumberType(value / divisor);
            },
            inc: () => new NumberType(value++),
            dec: () => new NumberType(value--),
            modulo: (obj) => new NumberType(value % obj.getValue()),
            lt: (obj) => new bool_1.BoolType(value < obj.getValue()),
            gt: (obj) => new bool_1.BoolType(value > obj.getValue()),
            eq: (obj) => new bool_1.BoolType(value === obj.getValue()),
            neq: (obj) => new bool_1.BoolType(value !== obj.getValue()),
            get: (prop, args) => {
                const _prop = prop.getValue();
                const methods = ["sqrt", "abs", "ceil", "floor", "round", "trunc", "pow"];
                if (!methods.find((method) => method == _prop)) {
                    throw new Error(`The number object lacks method: '${_prop}'`);
                }
                return new function_1.FunctionType(new types_1.FunctionDecNode(new types_1.IdentifierNode(_prop), undefined, new types_1.BlockNode([
                    new types_1.ReturnNode(new types_1.NumberNode(m[_prop](value, args.map((val) => val.getValue()))))
                ])));
            }
        });
    }
}
exports.NumberType = NumberType;
