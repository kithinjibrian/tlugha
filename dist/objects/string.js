"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringType = void 0;
const types_1 = require("../types");
const base_1 = require("./base");
const function_1 = require("./function");
let m = {
    length(value) {
        return new types_1.NumberNode(value.length);
    },
    split(value) {
        return new types_1.ArrayNode(value.split("").map((ch) => new types_1.StringNode(ch)));
    }
};
class StringType extends base_1.Type {
    constructor(value) {
        super("string", value, {
            add: (obj) => new StringType(value + obj.getValue()),
            str: () => `"${value}"`,
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
            }
        });
    }
}
exports.StringType = StringType;
