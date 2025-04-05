import { exec } from "./types";

export * from "./types";

function main() {
    try {
        const result = exec("code/app.la");
        console.log(result)
    } catch (e: any) {
        console.log(`main error: \n\n ${e.message}`)
    }
}

if (require.main == module) {
    main()
}