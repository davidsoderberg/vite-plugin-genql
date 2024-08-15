import { generate } from '@genql/cli';
import fs from 'fs';

interface Config {
  // Is used when `endpoint` is present and allow you to modifiy the request being made to your endpoint allows to add needed headers or other releveant data to reach your endpoint.
  fetchOptions?: RequestInit;
  // path to what folder generated files should be written.
  outputPath: string;
  // needs to be an endpoint that exposes the schema as plain text.
  endpoint?: string;
  // path to graphql.schema file.
  path?: string;
  // Will generate verbose logs from genqls `generate` function.
  verbose?: boolean;
  // Allows you to add scalar types.
  scalarTypes?: { [k: string]: string };
  // Will sort your schema before translating it to JavaScript code.
  sortProperties?: boolean;
}

export const genql = ({
  outputPath,
  endpoint,
  path,
  fetchOptions,
  ...config
}: Config) => {
  return {
    enforce: 'pre',
    name: 'generate-genql-client',
    buildStart: async () => {
      if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true, force: true });
      }

      let schema = '';

      if (path && fs.existsSync(path)) {
        schema = fs.readFileSync(path).toString();
      }

      if (schema.length === 0 && endpoint) {
        const response = await fetch(endpoint, fetchOptions);
        schema = await response.text();
      }

      if (schema.length === 0) {
        throw new Error(
          'No schema provided, please provide url or path to schema'
        );
      }

      await generate({
        schema,
        output: outputPath,
        ...config,
      });
    },
  };
};

export default genql;
