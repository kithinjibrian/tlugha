"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayType = void 0;
const types_1 = require("../types");
const base_1 = require("./base");
const create_1 = require("./create");
const function_1 = require("./function");
let m = {
    length(value) {
        return new types_1.NumberNode(value.length);
    },
    pop(value) {
        const v = value.pop();
        if (v)
            return (0, create_1.create_node)(v);
    },
    push(value, args) {
        value.push((0, create_1.create_object)(args[0]));
    },
    join(value) {
        return new types_1.StringNode(value.map(v => v.getValue()).join(""));
    }
};
class ArrayType extends base_1.Type {
    constructor(value) {
        super("array", value, {
            str: () => `[${value.map(v => v.str()).join(", ")}]`,
            getValue: () => {
                return value.map(i => {
                    return i.getValue();
                });
            },
            get: (obj, args) => {
                const index = obj.getValue();
                if (obj.type == "string") {
                    return new function_1.FunctionType(new types_1.FunctionDecNode(new types_1.IdentifierNode(index), undefined, new types_1.BlockNode([
                        new types_1.ReturnNode(m[index](value, args.map((val) => val.getValue())))
                    ])));
                }
                else {
                    if (index >= 0 && index < value.length) {
                        return value[index];
                    }
                    throw new Error(`Index ${index} out of bounds`);
                }
            },
            set: (index, newValue) => {
                const idx = index.getValue();
                if (idx < 0 || idx >= value.length) {
                    throw new Error(`Index ${idx} out of bounds`);
                }
                value[idx] = newValue; // Set the new value at the specified index
            }
        });
    }
}
exports.ArrayType = ArrayType;
