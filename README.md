# @david.southmountain/vite-plugin-genql

A vite plugin to use genql in your frontend projects.

"Genql translate JavaScript code into GraphQL queries, enabling you to get auto completion and validation for your GraphQL queries."

## Example

```
import { defineConfig } from ‘vite’;
import react from ‘@vitejs/plugin-react’;
import { genql } from '@david.southmountain/vite-plugin-genql';

export default defineConfig({
 plugins: [
  genql({
    outputPath: path.join(__dirname, '/src/client'),
    endpoint: 'https://yourdomain.com/schema',
  }), 
  react()
 ]
});
```

Remeber to add `src/client` to your `.gitignore` file because genql will generate the same code when you build your code for production.

## Config

### fetchOptions
`fetchOptions` is used when `endpoint` is present and allow you to modifiy the request being made to your endpoint allows to add needed headers or other releveant data to reach your endpoint.

### sortProperties
Will sort your schema before translating it to JavaScript code.

### scalarTypes
Allows you to add scalar types.

### verbose
Will generate verbose logs from genqls `generate` function.