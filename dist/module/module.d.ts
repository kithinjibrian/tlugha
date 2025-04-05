export declare class Frame {
    parent: Frame | null;
    name: string;
    stack: any[];
    break_flag: boolean;
    return_flag: boolean;
    continue_flag: boolean;
    symbol_table: Map<string, any>;
    return_value: any;
    constructor(parent?: Frame | null, name?: string);
    define(name: string, value: any): void;
    get(name: string): any;
    assign(name: string, value: any): void;
}
export declare class Module {
    name: string;
    parent: Module | null;
    children: Module[];
    frame: Frame;
    constructor(name: string);
    add_submodule(child: Module): void;
}
//# sourceMappingURL=module.d.ts.map