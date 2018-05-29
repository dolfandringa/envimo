import { ValidatorFn } from '@angular/forms';
import { OptionConfig } from './option-config.interface';


export interface FieldConfig {
    key: string,
    fieldType: string,
    subforms?: string[],
    value?: any,
    label?: string,
    required?: boolean,
    order?: number,
    validators?: ValidatorFn[],
    contentMediaType?: string,
    contentEncoding?: string,
    options?: OptionConfig[],
    stringFormat?: string
}
