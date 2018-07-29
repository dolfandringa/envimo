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

export interface GeometryFieldConfig extends FieldConfig{
    lat_key: string,
    lon_key: string
}

export interface FieldSetConfig extends FieldConfig{
    fields: FieldConfig[]
}
