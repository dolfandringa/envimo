import { FieldConfig } from './field-config.interface';

export interface Condition {
    allowed_values: {[s: string]: any[]},
    conditional_fields: FieldConfig[],
    required: string[]
}
