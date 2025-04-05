# Typescript interpreter for the Lugha programming language

# Installation

```
npm install @kithinji/tlugha
```

# Instruction

A simple hello world program in lugha.

```lugha
// in file app.la
use std::io::{ print };

// the main function is called automatically
fun main(): string {
    let str = "return to typescript";
    print("{}", str);

    return str;
}
```

Executing the code in Typescript

```ts
import { exec } from "@kithinji/tlugha";

function main() {
    try {
        const result = exec("app.la");
        console.log(result); // output: return to typescript
    } catch(e) {
        console.error(e);
    }
}

main();
```


