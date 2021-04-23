export const FORM_BUILDER_DATA = `
declare module 'json-schema' {
\t/**
\t * MIT License
\t *
\t * Copyright (c) 2016 Richard Adams (https://github.com/enriched)
\t *
\t * Permission is hereby granted, free of charge, to any person obtaining a copy
\t * of this software and associated documentation files (the "Software"), to deal
\t * in the Software without restriction, including without limitation the rights
\t * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
\t * copies of the Software, and to permit persons to whom the Software is
\t * furnished to do so, subject to the following conditions:
\t *
\t * The above copyright notice and this permission notice shall be included in all
\t * copies or substantial portions of the Software.
\t *
\t * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
\t * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
\t * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
\t * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
\t * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
\t * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
\t * SOFTWARE.
\t */

\texport interface JsonSchema {
\t  $ref?: string;
\t  /////////////////////////////////////////////////
\t  // Schema Metadata
\t  /////////////////////////////////////////////////
\t  /**
\t   * This is important because it tells refs where
\t   * the root of the document is located
\t   */
\t  id?: string;
\t  /**
\t   * It is recommended that the meta-schema is
\t   * included in the root of any JSON Schema
\t   */
\t  $schema?: JsonSchema;
\t  /**
\t   * Title of the schema
\t   */
\t  title?: string;
\t  /**
\t   * Schema description
\t   */
\t  description?: string;
\t  /**
\t   * Default json for the object represented by
\t   * this schema
\t   */
\t  'default'?: any;

\t  /////////////////////////////////////////////////
\t  // Number Validation
\t  /////////////////////////////////////////////////
\t  /**
\t   * The value must be a multiple of the number
\t   * (e.g. 10 is a multiple of 5)
\t   */
\t  multipleOf?: number;
\t  maximum?: number;
\t  /**
\t   * If true maximum must be > value, >= otherwise
\t   */
\t  exclusiveMaximum?: boolean;
\t  minimum?: number;
\t  /**
\t   * If true minimum must be < value, <= otherwise
\t   */
\t  exclusiveMinimum?: boolean;

\t  /////////////////////////////////////////////////
\t  // String Validation
\t  /////////////////////////////////////////////////
\t  maxLength?: number;
\t  minLength?: number;
\t  /**
\t   * This is a regex string that the value must
\t   * conform to
\t   */
\t  pattern?: string;

\t  /////////////////////////////////////////////////
\t  // Array Validation
\t  /////////////////////////////////////////////////
\t  additionalItems?: boolean | JsonSchema;
\t  items?: JsonSchema | JsonSchema[];
\t  maxItems?: number;
\t  minItems?: number;
\t  uniqueItems?: boolean;

\t  /////////////////////////////////////////////////
\t  // Object Validation
\t  /////////////////////////////////////////////////
\t  maxProperties?: number;
\t  minProperties?: number;
\t  required?: string[];
\t  additionalProperties?: boolean | JsonSchema;
\t  /**
\t   * Holds simple JSON Schema definitions for
\t   * referencing from elsewhere.
\t   */
\t  definitions?: {[key: string]: JsonSchema};
\t  /**
\t   * The keys that can exist on the object with the
\t   * json schema that should validate their value
\t   */
\t  properties?: {[property: string]: JsonSchema};
\t  /**
\t   * The key of this object is a regex for which
\t   * properties the schema applies to
\t   */
\t  patternProperties?: {[pattern: string]: JsonSchema};
\t  /**
\t   * If the key is present as a property then the
\t   * string of properties must also be present.
\t   * If the value is a JSON Schema then it must
\t   * also be valid for the object if the key is
\t   * present.
\t   */
\t  dependencies?: {[key: string]: JsonSchema | string[]};

\t  /////////////////////////////////////////////////
\t  // Generic
\t  /////////////////////////////////////////////////
\t  /**
\t   * Enumerates the values that this schema can be
\t   * e.g.
\t   * {"type": "string",
\t     *  "enum": ["red", "green", "blue"]}
\t   */
\t  'enum'?: any[];
\t  /**
\t   * The basic type of this schema, can be one of
\t   * [string, number, object, array, boolean, null]
\t   * or an array of the acceptable types
\t   */
\t  type?: 'string' | 'number' | 'object' | 'array' | 'boolean' | 'null';

\t  /////////////////////////////////////////////////
\t  // Combining Schemas
\t  /////////////////////////////////////////////////
\t  allOf?: JsonSchema[];
\t  anyOf?: JsonSchema[];
\t  oneOf?: JsonSchema[];
\t  /**
\t   * The entity being validated must not match this schema
\t   */
\t  not?: JsonSchema;
\t}\t
}

declare module '@jaspero/form-builder' {
\timport { JsonSchema } from 'json-schema';
    import { Definitions } from 'definitions';
    import { Segment } from 'form-builder/segment.interface';
    export interface FormBuilderData {
        value?: any;
        schema: JsonSchema;
        definitions?: Definitions;
        segments?: any;
        // segments?: any[];
        layout?: {
        \tinstance?: {
            segments?: any[];
            fields?: any[];
        \t}
        }
        // segments?: Segment[];
    }

    // export interface Definition 

    export interface Definitions {
        [key: string]: {
            component?: ComponentDefinition;
            formatOnSave?: string;
            formatOnCreate?: string;
            formatOnEdit?: string;
            formatOnLoad?: string;
            label?: string;
            hint?: string;
            defaultValue?: any;
            placeholder?: string;
            onlyOn?: any;
            disableOn?: any;
            // onlyOn?: State | State[];
            // disableOn?: State | State[];
            disableForRoles?: string | string[];
            class?: string;
            /**
              * If provided only users with the appropriate
              * role see the field
              */
            roles?: string | string[];
            columnsDesktop?: number;
            columnsTablet?: number;
            columnsMobile?: number;
        };
    }

    export interface ComponentDefinition {
        type: 'input' | 'select' | 'file' | 'image' | 'gallery' | 'toggle' | 'checkbox' | 'date' | 'range' | 'radio' | 'slider' | 'autocomplete' | 'chips' | 'draggable' | 'textarea';
        // type: ComponentType | string;
        configuration?: any;
        testinga?: string;
    }

    export enum ComponentType {
\t    Input = "input",
\t    Select = "select",
\t    File = "file",
\t    Image = "image",
\t    Gallery = "gallery",
\t    Toggle = "toggle",
\t    Checkbox = "checkbox",
\t    Date = "date",
\t    Range = "range",
\t    Radio = "radio",
\t    Slider = "slider",
\t    Autocomplete = "autocomplete",
\t    Chips = "chips",
\t    Draggable = "draggable",
\t    Textarea = "textarea"
\t}
}`;
