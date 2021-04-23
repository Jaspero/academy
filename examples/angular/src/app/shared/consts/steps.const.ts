import { FormBuilderData } from '@jaspero/form-builder';

const jsonToString = (json: any, space = 2) => {
  return JSON.stringify(json, null, space);
};

const template = (data: object = {}) => {

  const dataString = JSON.stringify({
    schema: {},
    layout: {},
    definitions: {},
    ...data
  }, null, 2).replace(/"([^"]+)":/g, '$1:').slice(1, -1);

  return `import {FormBuilderData, Definition, Definitions, ComponentDefinition, ComponentType} from '@jaspero/form-builder';

const data: FormBuilderData = {
  /*multiLineEditableArea=
  ${dataString}
*/
};`;
}

export const STEPS = [
  {
    name: 'Intro',
    description: `A module represents a collection in the database.
<br><br>
It consists of three configurations:<br>
<ul>
    <li><b>schema</b></li>
    <li><b>layout</b></li>
    <li><b>definitions</b></li>
</ul>`,
    startWith: template()
  },
  {
    name: 'Schema',
    description: `The schema is a standard <a href="https://json-schema.org/" target="_blank">JSON Schema</a>.<br><br>It is used to <b>define</b> the format of documents in the collection.<br>Similarly like the TypeScript Interface defines object's properties.`,
    startWith: template({
      schema: {
        properties: {
          name: {
            type: 'string'
          },
          age: {
            type: 'number'
          }
        }
      }
    })
  },
  {
    name: 'Layout',
    description: `The layout is used for configuring how the schema is <b>displayed</b> in the overview and form segments.`,
    startWith: template({
      layout: {
        instance: {
          segments: [
            {
              fields: [
                '/name',
                '/age'
              ]
            }
          ]
        }
      },
    })
  },
  {
    name: 'Definitions',
    description: `Definitions are used for defining additional field options.<br><br>Like changing the <b>label</b> or <b>type of component</b> used to represent the field in the form.`,
    startWith: template({
      definitions: {
        name: {
          label: 'Name',
          defaultValue: 'John Doe'
        },
        age: {
          label: 'Age',
          component: {
            type: 'slider'
          }
        }
      }
    })
  },
  {
    name: 'Example Overview',
    description: `Previous configurations combined provide following code:`,
    startWith: template({
      schema: {
        properties: {
          name: {
            type: 'string'
          },
          age: {
            type: 'number'
          }
        }
      },
      layout: {
        instance: {
          segments: [
            {
              fields: [
                '/name',
                '/age'
              ]
            }
          ]
        }
      },
      definitions: {
        name: {
          label: 'Name',
          defaultValue: 'John Doe'
        },
        age: {
          label: 'Age',
          component: {
            type: 'slider'
          }
        }
      }
    })
  },
  {
    name: 'Schema#1',
    description: `Add field 'surname' with type string to schema properties.`,
    startWith: template({
      schema: {
        properties: {
          name: {
            type: 'string'
          },
          age: {
            type: 'number'
          }
        }
      },
      layout: {
        instance: {
          segments: [
            {
              fields: [
                '/name',
                '/age'
              ]
            }
          ]
        }
      },
      definitions: {
        name: {
          label: 'Name',
          defaultValue: 'John Doe'
        },
        age: {
          label: 'Age',
          component: {
            type: 'slider'
          }
        }
      }
    }),
    validate: (content: string) => {

      const search = 'const data: FormBuilderData = ';

      const code = content.slice(content.indexOf(search) + search.length);

      let data: Partial<FormBuilderData & any> = {
        schema: {},
        layout: {},
        definitions: {}
      };

      try {
        const compile = Function(`return ${code}`);

        data = {
          ...data,
          ...compile()
        };

        if (data?.layout?.instance?.segments) {
          data.segments = data.layout.instance.segments;
        }

        if (data?.schema?.properties?.surname?.type === 'string') {
          return true;
        }

      } catch (error) {
        console.log({error});
      }

      return false;
    }
  },
  {
    name: 'Field-Autocomplete',
    description: `
    {
  dataSet: Array<{name: string; value: any}>;
  populate?: {
    collection: string;
    nameKey: string;
    valueKey?: string;
    orderBy?: string;
    filter?: WhereFilter;
    limit?: number;
  };
  autocomplete?: string;
  suffix?: HSD | string;
  prefix?: HSD | string;
}`,
    startWith: template({
      definitions: {
        city: {
          label: 'City',
          component: {
            type: 'autocomplete',
            configuration: {
              dataSet: [
                {
                  value: 'New York',
                  name: 'New York'
                },
                {
                  value: 'Paris',
                  name: 'Paris'
                },
                {
                  value: 'London',
                  name: 'London'
                },
                {
                  value: 'Zagreb',
                  name: 'Zagreb'
                },
                {
                  value: 'Barcelona',
                  name: 'Barcelona'
                },
                {
                  value: 'Tokyo',
                  name: 'Tokyo'
                }
              ]
            }
          }
        }
      },
      schema: {
        properties: {
          city: {
            type: 'string'
          }
        }
      }
    })
  }

];
