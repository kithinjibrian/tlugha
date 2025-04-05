"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtin = void 0;
const sync_request_1 = require("sync-request");
exports.builtin = {
    __print__: {
        type: "function",
        signature: "<T, U>(args: T) -> U",
        exec: (args) => {
            let formatted = args[0];
            args[1].forEach((arg) => {
                formatted = formatted.replace("{}", JSON.stringify(arg, null, 2));
            });
            console.log(formatted);
        }
    },
    __http_get__: {
        type: "function",
        async: true,
        signature: "<T, U>(args: T) -> U",
        exec: (args) => {
            let result = (0, sync_request_1.default)('GET', args[0], {
                headers: args[1]
            });
            return JSON.parse(result.getBody('utf8'));
        }
    },
    __http_post__: {
        type: "function",
        async: true,
        signature: "<T, U>(args: T) -> U",
        exec: (args) => {
            let result = (0, sync_request_1.default)('POST', args[0], {
                json: args[1],
                headers: args[2]
            });
            return JSON.parse(result.getBody('utf8'));
        }
    }
};
