"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtin = void 0;
const axios_1 = require("axios");
const promises_1 = require("fs/promises");
exports.builtin = {
    __version__: {
        type: "variable",
        signature: "string",
        value: "Lugha v1.0.0"
    },
    __print__: {
        type: "function",
        signature: "<T, U>(args: T) -> U",
        exec: (args) => {
            let formatted = args[0];
            const values = args[1];
            let index = 0;
            formatted = formatted.replace(/\{\}/g, () => {
                const val = index < values.length ? values[index++] : "{}";
                return JSON.stringify(val, null, 2);
            });
            console.log(formatted);
            return null;
        }
    },
    __http_get__: {
        type: "function",
        async: true,
        signature: "<T, U>(args: T) -> U",
        exec: (args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(args[0], args[1]);
                const { config, request } = res, rest = __rest(res, ["config", "request"]);
                return rest;
            }
            catch (e) {
                console.log(e);
            }
        })
    },
    __http_post__: {
        type: "function",
        async: true,
        signature: "<T, U>(args: T) -> U",
        exec: (args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.post(args[0], args[1], args[2]);
                const { config, request } = res, rest = __rest(res, ["config", "request"]);
                return rest;
            }
            catch (e) {
                console.log(e);
            }
        })
    },
    __read__: {
        type: "function",
        async: true,
        signature: "<T, U>(args: T) -> U",
        exec: (args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const res = yield (0, promises_1.readFile)(args[0], args[1]);
                return res;
            }
            catch (e) {
                console.log(e);
            }
        })
    },
    __write__: {
        type: "function",
        async: true,
        signature: "<T, U>(args: T) -> U",
        exec: (args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield (0, promises_1.writeFile)(args[0], args[1]);
            }
            catch (e) {
                console.log(e);
            }
        })
    }
};
