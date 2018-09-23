import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormConfig } from './models/form-config.interface';
import { GeometryFieldConfig, FieldConfig, FieldSetConfig } from './models/field-config.interface';
import { IntegerValidator } from './fields/validators';


@Injectable()
export class DynamicFormService {
  private modals = {};

  constructor(
  ) {
  }


  getDefinition(schema :object, ref :string) :[string, object]{
    let defname = ref.split('/').pop()
    console.log('Getting definition for ', defname,': ',schema['definitions'][defname]);
    return [defname, schema['definitions'][defname]];
  }

  showSubForm(sfkey) {
    let modal = this.modals[sfkey];
    console.log('Show modal', modal);
    console.log('Resetting', modal._component);
    modal._component.reset();
    modal.present();
  }

  mapField(propkey, prop, mainschema, required): [{[s: string]: FormConfig}, FieldConfig]{
    let fieldConfig: FieldConfig;
    let subForms:{[s: string]: FormConfig} = {};
    if (prop['type'] == 'array' || 'enum' in prop){
      let retval = this.mapSelectField(propkey, prop, mainschema);
      fieldConfig = retval[1];
      console.log('Retval', retval);
      for (let sfkey in retval[0]){
        console.log("Subform", retval[0][sfkey])
        subForms[sfkey] = retval[0][sfkey];
      }
    }
    else if('contentMediaType' in prop){
      fieldConfig = this.mapMediaField(propkey, prop);
    }
    else{
      fieldConfig = this.mapSimpleField(propkey, prop);
    }
    if(required.indexOf(fieldConfig.key) > -1){
      console.log("Field", fieldConfig.key, "is required.");
      fieldConfig.validators.push(Validators.required);
    }
    else{
      console.log(fieldConfig.key, "not in", required);
    }
    return [subForms, fieldConfig]
  }

  mapLocationField(fieldsetname, fieldset, fields): GeometryFieldConfig{
    let fieldConfig: GeometryFieldConfig = {
      key: fieldsetname+'_'+'offlinemap',
      fieldType: 'locationfield',
      validators: [],
      subforms: [],
      label: '',
      lat_key: fields['lat']['key'],
      lon_key: fields['lon']['key']
    };
    return fieldConfig
  }

  mapFieldSet(propkey, prop, mainschema):[{[s: string]: FormConfig}, FieldSetConfig]{
    let fieldConfig: FieldSetConfig = {
      key: propkey,
      fieldType: 'fieldset',
      fields: [],
      validators: [],
      subforms: [],
      label: prop['title']
    }
    let required = [];
    if('required' in prop){
      required = prop['required'];
    }
    let subforms: {[s: string]: FormConfig} = {};
    let geometry_fields = {};
    for(let spropkey in prop['properties']){
      let sprop = prop['properties'][spropkey];
      if ('format' in sprop){
        let fmt = sprop['format'];
        if (fmt == 'coordinate_point_longitude' || fmt == 'coordinate_point_latitude'){ 
          if (fmt == 'coordinate_point_longitude'){ 
            geometry_fields['lon'] = {key: spropkey, field: sprop};
          }
          if (fmt == 'coordinate_point_latitude'){
            geometry_fields['lat'] = {key: spropkey, field: sprop};
          }
          let keys = Object.keys(geometry_fields);
          if(keys.indexOf('lat')>=0 && keys.indexOf('lon')>=0){
            fieldConfig.fields.push(
              this.mapLocationField(propkey, prop, geometry_fields));
            fieldConfig.fields.push(
              this.mapSimpleField(
                geometry_fields['lat']['key'],
                geometry_fields['lat']['field']));
            fieldConfig.fields.push(
              this.mapSimpleField(
                geometry_fields['lon']['key'],
                geometry_fields['lon']['field']));
          }
          continue;
        }
      }
      let retval = this.mapField(spropkey, sprop, mainschema, required);
      for(let sfkey in retval[0]){
        subforms[sfkey] = retval[0][sfkey];
      }
      fieldConfig.fields.push(retval[1]);
    }
    return [subforms, fieldConfig];
  }

  mapJSONForm(formschema, formkey, mainschema): FormConfig{
    let formConfig: FormConfig = {
      key: formkey,
      title: formschema['title'],
      fields: [],
      subforms: {}
    }
    let required = [];
    if('required' in formschema){
      required = formschema['required'];
    }
    console.log("Required fields:", required);
    for (let propkey in formschema['properties']){
      let prop = formschema['properties'][propkey];
      if(prop['type'] == 'object' && 'properties' in prop){
        let retval = this.mapFieldSet(propkey, prop, mainschema);
        formConfig.fields.push(retval[1]);
        for(let sfkey in retval[0]){
          formConfig.subforms[sfkey] = retval[0][sfkey];
        }
      }
      else{
        let retval = this.mapField(propkey, prop, mainschema, required);
        for(let sfkey in retval[0]){
          formConfig.subforms[sfkey] = retval[0][sfkey];
        }
        formConfig.fields.push(retval[1]);
      }
    }
    console.log('formConfig',formConfig);
    return formConfig;
  }

  mapJSONSchema(schema): {[s: string]: FormConfig}{
    let forms: {[s: string]: FormConfig} = {};
    console.log("Schema", schema);
    for (let formkey in schema['properties']){
      console.log('formkey', formkey);
      let formschema: object;
      if('$ref' in schema['properties'][formkey]){
        let ref = schema['properties'][formkey]['$ref'];
        formschema = this.getDefinition(schema, ref)[1];
      }
      else{
        formschema = schema['properties'][formkey];
      }
      console.log("Formschema", formschema);
      let formConfig = this.mapJSONForm(formschema, formkey, schema);
      forms[formkey] = formConfig;
    }
    console.log('forms', forms);
    return forms;
  }

  mapMediaField(key, prop): FieldConfig{
    console.log('Mapping media field', key, 'with properties', prop);
    let fieldConfig: FieldConfig = {
      key: key,
      fieldType: 'unkown',
      validators: [],
      subforms: [],
      label: prop['title'],
      contentMediaType: prop['contentMediaType'],
      contentEncoding: prop['contentEncoding'],
    }
    if (['image/png', 'image/jpeg'].indexOf(prop['contentMediaType'])>-1){
      fieldConfig.fieldType = 'imagefield';
    }
    return fieldConfig;
  }

  mapSelectField(key, prop, schema) :[{[s: string]: FormConfig}, FieldConfig]{
    let fieldConfig: FieldConfig = {
      key: key,
      fieldType: 'unkown',
      label: prop['title'],
      options: [],
      subforms: [],
      validators: [],
    };
    let subforms: {[s: string]: FormConfig} = {};
    if (prop['type'] == 'array'){
      fieldConfig.value = [];
      for (let ikey in prop['items']){
        let item = prop['items'][ikey];
        if('$ref' in item){
          let ref = item['$ref'];
          let subschema = this.getDefinition(schema, ref);
          let subform = this.mapJSONForm(subschema[1], subschema[0], schema);
          subforms[subschema[0]]=subform;
          fieldConfig.subforms.push(subschema[0]);
        }
        else{
          fieldConfig.options.push(item);
        }
      }
      fieldConfig.fieldType = 'multipleselectfield';
    }
    else{ 
      if ('enum' in prop){
        fieldConfig.options = prop['enum'];
      }
      fieldConfig.fieldType = 'selectfield';
    }
    return [subforms, fieldConfig];
  }

  mapSimpleField(key, prop) :FieldConfig{
    let fieldConfig: FieldConfig = {
      key: key,
      fieldType: 'unkown',
      label: prop['title'],
      validators: []
    }
    let ft = prop['type'];
    if ('minimum' in prop){
      fieldConfig.validators.push(Validators.min(prop['minimum']));
    }
    if ('maximum' in prop){
      fieldConfig.validators.push(Validators.max(prop['maximum']));
    }
    if ('minLength' in prop){
      fieldConfig.validators.push(Validators.min(prop['minLength']));
    }
    if ('maxLength' in prop){
      fieldConfig.validators.push(Validators.max(prop['maxLength']));
    }
    switch (ft) {
      case 'string':
        if ('format' in prop){
          switch(prop['format']){
            case 'date-time':
              fieldConfig.fieldType = 'datetimefield';
              break;
            case 'email':
              fieldConfig.fieldType = 'stringfield'
              fieldConfig.stringFormat = 'email';
              fieldConfig.validators.push(Validators.email);
              break;
            case 'coordinate_point_longitude':
              fieldConfig.fieldType = 'stringfield'
              break;
            case 'coordinate_point_latitude':
              fieldConfig.fieldType = 'stringfield'
              break;
          }
        }
        else{
          fieldConfig.fieldType = 'stringfield';
        }
        break;
      case 'integer':
        fieldConfig.fieldType = 'integerfield';
        fieldConfig.validators.push(IntegerValidator());
        break;
      case 'number':
        fieldConfig.fieldType = 'numberfield';
        break;
    }
    return fieldConfig;
  }
  
}
