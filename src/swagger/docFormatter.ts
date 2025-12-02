export interface ParameterObject {
  name: string;
  in: string;
  schema: {
    type: any;
    enum?: any[]; // allow enumerated values
    default?: any;
    format?: string;
    items?: any;
    properties?: any;
    description?: string;
    [key: string]: any; // flexible for additional OpenAPI schema keywords
  };
  example?: any;
  required?: boolean;
}

export default (
  method: "post" | "delete" | "put" | "get" | "patch",
  tags: string,
  description: string | null,
  security: boolean = true,
  parameters: ParameterObject[] = [],
  add: string | null = null,
  properties: any = null,
  responses: any = {},
  contentType: "application/json" | "multipart/form-data" = "application/json"
) => {
  return {
    [method]: {
      tags: [tags],
      description,
      security: security
        ? [
            {
              BearerAuth: [],
            },
          ]
        : [],
      parameters:
        add === "default" //if you dont want to add new parameter just the default page and limit
          ? [
              {
                name: "page",
                in: "query",
                schema: {
                  type: "number",
                },
                example: 1,
              },
              {
                name: "limit",
                in: "query",
                schema: {
                  type: "number",
                },
                example: 10,
              },
            ]
          : add === "add" //if you want to add to the default parameter to include others aside from page and limit
          ? [
              {
                name: "page",
                in: "query",
                schema: {
                  type: "number",
                },
                example: 1,
              },
              {
                name: "limit",
                in: "query",
                schema: {
                  type: "number",
                },
                example: 10,
              },
              ...parameters,
            ]
          : parameters, // you only want the parameter you defined
      requestBody: properties
        ? {
            content: {
              [contentType]: {
                schema: {
                  type: "object",
                  properties,
                },
              },
            },
          }
        : {},
      responses: {
        200: {
          description: "success",
        },
        ...responses,
        "4xx": {
          description: "error",
        },
      },
    },
  };
};
