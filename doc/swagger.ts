
export interface SwaggerFile {
  swagger: string;
  info: {
    version: string;
    title: string;
  };
  host: string;
  basePath: string;
  schemes: string[];
  paths: {
    [key: string]: SwaggerPath,
  };
  definitions: SwaggerDefinition;
}

export interface SwaggerPath {
  post: SwaggerAction;
}

export interface SwaggerAction {
  tags: string[];
  operationId: string;
  consumes: string[];
  produces: string[];
  parameters: {
    name: string;
    in: string;
    required: boolean;
    schema: {
      $ref: string;
    }
  }[];
  responses: {
    '200': {
      description: string;
      schema?: {
        $ref: string;
      }
    },
  };
}

export interface SwaggerDefinition {
  [key: string]: {
    type: string;
    properties: SwaggerDefinitionProperties
  };
}

export interface SwaggerDefinitionProperties {
  [key: string]: {
    // type => array, boolean, integer, null, number, object, string
    type?: string;

    // type => definition
    $ref?: string;

    // type => array
    items?: {
      type?: string;
      $ref?: string;
    }

    description?: string;
  };
}
