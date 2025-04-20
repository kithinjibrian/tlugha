import { ASTNode, ASTVisitor, exec, Extension, ExtensionStore } from "./types";

export * from "./types";

class Save extends Extension<ASTVisitor> {
    public name = "save";

    before_accept(node: ASTNode) { }

    after_accept(node: ASTNode) { }

    handle_node(node: ASTNode) { }

    before_run() {
        return []
    }
}

async function main() {
    try {

        const reg = ExtensionStore.get_instance();

        reg.register(new Save())

        await exec({
            filepath: "code/app.la"
        });

        //console.log(result)
    } catch (e: any) {
        console.log(`main error: \n\n ${e}`)
    }
}

if (require.main == module) {
    main()
}