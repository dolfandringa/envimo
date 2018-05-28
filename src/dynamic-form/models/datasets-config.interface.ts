import { FormConfig } from './form-config.interface';

export interface DatasetsConfig{
  [dsk: string]: {
    [fk: string]: FormConfig
  }
}
