import { FieldConfig } from './field-config.interface';
import { Condition } from './condition.interface';

export interface FormConfig {
    key: string,
    title: string,
    fields: FieldConfig[],
    form_type: string,
    oneOf: Condition[],
    subforms: {
      [s: string]: FormConfig
    }
}
