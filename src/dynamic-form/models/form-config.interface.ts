import { FieldConfig } from './field-config.interface';

export interface FormConfig {
    key: string,
    title: string,
    fields: FieldConfig[],
    subforms: {
      [s: string]: FormConfig
    }
}
