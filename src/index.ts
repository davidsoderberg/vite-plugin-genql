import { generate } from '@genql/cli';
import { Config } from '@genql/cli/dist/config.js';
import fs from 'fs';
import { PluginOption } from 'vite';

interface IConfig
  extends Pick<
    Config,
    'verbose' | 'scalarTypes' | 'sortProperties' | 'endpoint'
  > {
  // Is used when `endpoint` is present and allow you to modifiy the request being made to your endpoint allows to add needed headers or other releveant data to reach your endpoint.
  fetchOptions?: RequestInit;
  // path to what folder generated files should be written.
  outputPath: string;
  // path to graphql.schema file.
  path?: string;
}

export const genql = ({
  outputPath,
  endpoint,
  path,
  fetchOptions,
  ...config
}: IConfig): PluginOption => {
  return {
    enforce: 'pre',
    name: 'generate-genql-client',
    buildStart: async () => {
      const genqlConfig: Config = {};
      if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true, force: true });
      }

      let schema: string | undefined = '';

      if (path && fs.existsSync(path)) {
        schema = fs.readFileSync(path).toString();
      }

      if (schema.length === 0 && endpoint) {
        try {
          const response = await fetch(endpoint, fetchOptions);
          schema = await response.text();
        } catch (error) {
          console.error(error);
        }
      }

      if (schema.length === 0) {
        schema = undefined;
        if (fetchOptions?.headers) {
          genqlConfig.headers = fetchOptions.headers as Record<string, string>;
        }
        if (fetchOptions?.method?.toLowerCase() === 'get') {
          genqlConfig.useGet = true;
        }
        genqlConfig.endpoint = endpoint;
      }

      await generate({
        schema,
        output: outputPath,
        ...(Object.keys(genqlConfig).length > 0 ? genqlConfig : config),
      });
    },
  } as PluginOption;
};

export default genql;
