"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_node = create_node;
exports.create_object = create_object;
const types_1 = require("../types");
const array_1 = require("./array");
const bool_1 = require("./bool");
const map_1 = require("./map");
const number_1 = require("./number");
const string_1 = require("./string");
function create_node(value) {
    switch (value.type) {
        case "number":
            return new types_1.NumberNode(value.getValue());
        case "string":
            return new types_1.StringNode(value.getValue());
        default:
            break;
    }
}
function create_object(value) {
    if (value === null) {
        throw new Error("Null values are not supported");
    }
    if (typeof value == "number") {
        return new number_1.NumberType(value);
    }
    else if (typeof value == "string") {
        return new string_1.StringType(value);
    }
    else if (typeof value == "boolean") {
        return new bool_1.BoolType(value);
    }
    else if (typeof value == "object") {
        if (Array.isArray(value)) {
            return new array_1.ArrayType(value.map(v => create_object(v)));
        }
        else {
            return new map_1.MapType(Object.entries(value).reduce((acc, [key, val]) => {
                acc[key] = create_object(val);
                return acc;
            }, {}));
        }
    }
    throw new Error(`Unsupported data type: ${typeof value}`);
}
