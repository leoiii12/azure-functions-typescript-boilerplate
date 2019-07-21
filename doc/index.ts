import * as fs from 'fs';
import { dump } from 'js-yaml';
import *  as appRoot from 'app-root-path';

import { dtoEntries } from './dto';
import { functionEntries } from './function';
import { SwaggerDefinitionProperties, SwaggerFile, SwaggerPath } from './swagger';
import { extractClassAndImportPath, normalizeToSwaggerType } from './util';

const pkg: any = JSON.parse(fs.readFileSync('package.json').toString());
const hostJsonPath = `${appRoot}/src/host.json`;
const hostJson: any = JSON.parse(fs.readFileSync(hostJsonPath).toString());
const routePrefix = (hostJson.hasOwnProperty('extensions') && hostJson.extensions.hasOwnProperty('http')
                    && hostJson.extensions.http.hasOwnProperty('routePrefix')) ? hostJson.extensions.http. routePrefix : 'api';

const swaggerFile: SwaggerFile = {
  swagger: '2.0',
  info: {
    version: pkg.version,
    title: 'Azure Functions TypeScript Boilerplate',
  },
  host: 'localhost:7071/',
  basePath: `${routePrefix}`,
  schemes: [
    'http',
    'https',
  ],
  paths: {},
  definitions: {},
};

for (const { filePath, inputClassName, outputClassName } of functionEntries) {
  const functionJsonPath = filePath.replace('index.ts', 'function.json');

  const functionJsonString = fs.readFileSync(functionJsonPath).toString();
  const functionJson = JSON.parse(functionJsonString);
  const hasMethodKey = functionJson.bindings[0].hasOwnProperty('methods') ;
  const functionMethods  = hasMethodKey ? functionJson.bindings[0].methods : ['get'];

  if (!functionJsonString.includes('httpTrigger')) {
    continue;
  }

  const route = `/${functionJson.bindings[0].route}`;

  const regex = /([a-zA-Z]+)(\/[a-zA-Z]+)?/;
  const matches = regex.exec(route);
  if (matches === null) {
    throw new Error(`API URL not match the Regex : ${regex}`);
  }

  const tag = matches[1];

  // /api/Auth/Authenticate -> api_Auth_Authenticate
  const operationId = route.replace(/\//g, '_').slice(1);
  let path: SwaggerPath={};
  for (let method of functionMethods) {
    const innerJson = {
        operationId,
        tags: [
          tag,
        ],
        consumes: [
          'application/json',
        ],
        produces: [
          'application/json',
        ],
        parameters: [
          {
            in: 'header',
            name: 'X-Authorization',
            type: 'string',
            required: false,
          },
        ],
        responses: {
          200: {
            description: 'Success',
          },
        },
    };
    switch(method.toLowerCase()) {
      case 'get':
        path.get = innerJson;
        break;
      case 'post':
          path.post = innerJson;
        break;
      case 'put':
        path.put = innerJson;
        break;
      case 'delete':
          path.delete = innerJson;
        break;
      case 'patch':
          path.patch = innerJson;
        break;

    } 
  
    if (inputClassName !== undefined) {
      const parameter = {
        name: 'input',
        in: 'body',
        required: true,
        schema: {
          $ref: `#/definitions/${inputClassName}`,
        },
      };
      if (method === 'get') {
        if (path.get !== undefined) {
          path.get.parameters.push(parameter);
        }
      } else if (method === 'post') {
        if (path.post !== undefined) {
          path.post.parameters.push(parameter);
        }
      }  else if (method === 'put') {
        if (path.put !== undefined) {
          path.put.parameters.push(parameter);
        }
      }  else if ( method === 'patch') {
        if (path.patch !== undefined) {
          path.patch.parameters.push(parameter);
        }
      }  else if (method === 'delete') {
        if (path.delete !== undefined) {
          path.delete.parameters.push(parameter);
        }
      }
    }
  
    if (outputClassName !== undefined) {
      if (method === 'post') {
        if (path.post !== undefined) {
          path.post.responses[200].schema = {
            $ref: `#/definitions/${outputClassName}`,
          };
        }
      } else if (method === 'get') {
        if (path.get !== undefined) {
          path.get.responses[200].schema = {
            $ref: `#/definitions/${outputClassName}`,
          };
        }
      } else if (method === 'put') {
        if (path.put !== undefined) {
          path.put.responses[200].schema = {
            $ref: `#/definitions/${outputClassName}`,
          };
        }
      } else if (method === 'patch') {
        if (path.patch !== undefined) {
          path.patch.responses[200].schema = {
            $ref: `#/definitions/${outputClassName}`,
          };
        }
      } else if (method === 'delete') {
        if (path.delete !== undefined) {
          path.delete.responses[200].schema = {
            $ref: `#/definitions/${outputClassName}`,
          };
        }
      }
    }
    swaggerFile.paths[route] = path;
  }
}

for (const dtoEntry of dtoEntries) {
  const definition = {
    type: 'object',
    properties: {} as SwaggerDefinitionProperties,
  };

  for (const member of dtoEntry.members) {
    let type = member.type;
    if (type.includes('import')) {
      const { className } = extractClassAndImportPath(member.type);

      type = `#/definitions/${className}`;

      definition.properties[member.name] = type.endsWith('[]') ?
        {
          type: 'array',
          items: {
            $ref: normalizeToSwaggerType(type.replace('[]', '')),
          },
        } :
        {
          $ref: normalizeToSwaggerType(type),
        };

      if (member.decorators.length > 0) {
        definition.properties[member.name].description = member.decorators.join(' ');
      }

      continue;
    }

    definition.properties[member.name] = type.endsWith('[]') ?
      {
        type: 'array',
        items: {
          type: normalizeToSwaggerType(type.replace('[]', '')),
        },
      } :
      {
        type: normalizeToSwaggerType(type),
      };

    if (member.decorators.length > 0) {
      definition.properties[member.name].description = member.decorators.join(' ');
    }
  }

  swaggerFile.definitions[dtoEntry.className] = definition;
}

export const swaggerFileObj = swaggerFile;
export const swaggerYaml = dump(swaggerFile);
