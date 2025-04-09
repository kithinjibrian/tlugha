import { builtin, exec } from "./types";

export * from "./types";

async function main() {
    try {
        await exec("code/app.la");
        //console.log(result)
    } catch (e: any) {
        console.log(`main error: \n\n ${e}`)
    }
}

if (require.main == module) {
    main()
}