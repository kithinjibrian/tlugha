import { exec, ExtensionStore } from "./types";

export * from "./types";

async function main() {
    try {

        const reg = ExtensionStore.get_instance();

        await exec({
            filepath: "code/src/app.la"
        });

        //console.log(result)
    } catch (e: any) {
        console.log(`main error: \n\n ${e}`)
    }
}

if (require.main == module) {
    main()
}