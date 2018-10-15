import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormConfig } from './models/form-config.interface';
import { Condition } from './models/condition.interface';
import { GeometryFieldConfig, FieldConfig, FieldSetConfig } from './models/field-config.interface';
import { IntegerValidator } from './fields/validators';


class FormConverter {
  private subforms: {[s: string]: FormConfig};
  private schema: object;
  private forms: {[s: string]: FormConfig};

  constructor(schema: object) {
    this.schema = schema;
    this.forms = {};
    console.log("Schema", schema);
    this.subforms = this.getSubForms();

    for (let formkey in this.schema['properties']){
      let formConfig: FormConfig;
      console.log('formkey', formkey);
      if('$ref' in this.schema['properties'][formkey]){
        //Form already mapped through subform
        let ref = this.schema['properties'][formkey]['$ref'];
        formConfig = this.getSubFormFromRef(ref);
      }
      else{
        //Form defined directly in main properties
        let formschema = schema['properties'][formkey];
        formConfig = this.mapJSONForm(formschema, formkey);
      }

      console.log("Checking field subform references");

      // Check for all the referred subforms and add them to the config and correct the name reference.
      let subforms = this.getSubFormReferences(formConfig.fields);
      for(let sfkey in subforms){
        formConfig.subforms[sfkey] = this.subforms[sfkey];
        formConfig.subforms[sfkey].form_type = 'select_subform';
      }
      for (let condition of formConfig.oneOf){
        //Check referred subforms, add them to the config, correct the references and set field titles.
        let subforms = this.getSubFormReferences(condition.conditional_fields);
        for(let sfkey in subforms){
          formConfig.subforms[sfkey] = this.subforms[sfkey];
          formConfig.subforms[sfkey].form_type = 'conditional_subform';
          for (let field of subforms[sfkey]){
            if(field.label != ''){
              field.label = field.label + ' ';
            }
            field.label = field.label + this.subforms[sfkey].title;
          }
        }
      }
      this.forms[formkey] = formConfig;
    }
    console.log('forms', this.forms);
  }

  getSubFormReferences(fields: FieldConfig[]): {[s: string]: FieldConfig[]}{
    let subforms = {};
    for (let field of fields){
      let field_sfkeys = [];
      console.log("Checking field", field);
      if(!('subforms' in field)){
        continue;
      }
      for(let ref of field.subforms){
        console.log('Checking subform', ref);
        let sfkey = this.getFormKeyFromRef(ref);
        if (subforms[sfkey] === undefined){
          subforms[sfkey] = [];
        }
        console.log('sfkey', sfkey);
        subforms[sfkey].push(field);
        field_sfkeys.push(sfkey);
      }
      field.subforms = field_sfkeys;
      console.log("Finised checking field", field);
    }
    return subforms;
  }

  public getForms(){
    return this.forms;
  }

  mapConditions(form: FormConfig, conds: object[]) :Condition[]{
    console.log('Mapping conditions', conds);
    let known_fields = [];
    for (let field of form.fields){
      known_fields.push(field.key);
    }
    console.log('Got known fields', known_fields);

    let conditions: Condition[] = [];
    for(let cond of conds){
      let condition: Condition = {
        allowed_values: {},
        conditional_fields: [],
        required: [],
      }
      if('required' in cond){
        condition.required = cond['required'];
      }

      for(let propkey in cond['properties']){
        let prop = cond['properties'][propkey];
        if(known_fields.indexOf(propkey)>=0){
          condition.allowed_values[propkey] = [];
          for (let val of prop['enum']){
            condition.allowed_values[propkey].push(val['id']);
          }
        }
        else{
          let fieldConfig = this.mapField(propkey, prop, condition.required);
          condition.conditional_fields.push(fieldConfig);
        }
      }
      conditions.push(condition);
    }
    return conditions;
  }

  getFormKeyFromRef(ref: string){
    return ref.split('/').pop();
  }

  getSubFormFromRef(ref: string) :FormConfig{
    console.log('Getting SubForm for ref', ref);
    let sfkey = this.getFormKeyFromRef(ref);
    console.log('resulting sfkey', sfkey);
    console.log('Getting subform form', this.subforms);
    return this.subforms[sfkey];
  }
  
  getSubForms() :{[s: string]: FormConfig}{
    let subforms: {[s: string]: FormConfig} = {};
    for(let key in this.schema['definitions']){
      let subschema = this.schema['definitions'][key];
      let subform = this.mapJSONForm(subschema, key);
      subform.form_type = 'sequential_subform';
      subforms[key]=subform;
    }
    return subforms;
  }

  mapJSONForm(formschema, formkey): FormConfig{
    let formConfig: FormConfig = {
      key: formkey,
      title: formschema['title'],
      fields: [],
      form_type: 'main',
      oneOf: [],
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
        let fieldConfig = this.mapFieldSet(propkey, prop);
        formConfig.fields.push(fieldConfig);
      }
      else{
        let fieldConfig = this.mapField(propkey, prop, required);
        formConfig.fields.push(fieldConfig);
      }
    }
    if('oneOf' in formschema){
      formConfig.oneOf = this.mapConditions(formConfig, formschema['oneOf']);
    }
    console.log('formConfig',formConfig);
    return formConfig;
  }
  
  mapField(propkey, prop, required): FieldConfig{
    let fieldConfig: FieldConfig;
    if ('$ref' in prop){
      fieldConfig = this.mapSubFormField(propkey, prop);
    }
    else if (prop['type'] == 'array' || 'enum' in prop){
      fieldConfig = this.mapSelectField(propkey, prop);
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
    return fieldConfig
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

  mapFieldSet(propkey, prop): FieldSetConfig{
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
      let retval = this.mapField(spropkey, sprop, required);
      fieldConfig.fields.push(retval);
    }
    return fieldConfig;
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

  mapSubFormField(key, prop) :FieldConfig{
    let fieldConfig: FieldConfig = {
      key: key,
      fieldType: 'subformfield',
      label: '',
      validators: [],
      subforms: [prop['$ref']],
    };
    return fieldConfig;
  }

  mapSelectField(key, prop) : FieldConfig{
    let fieldConfig: FieldConfig = {
      key: key,
      fieldType: 'unkown',
      label: prop['title'],
      options: [],
      subforms: [],
      validators: [],
    };
    if (prop['type'] == 'array'){
      fieldConfig.value = [];
      for (let ikey in prop['items']){
        let item = prop['items'][ikey];
        if('$ref' in item){
          let ref = item['$ref'];
          fieldConfig.subforms.push(ref);
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
      /*if(fieldConfig.options.length <= 3){
        fieldConfig.fieldType = 'radiofield';
      }
      */
    }
    return fieldConfig;
  }

  mapSimpleField(key, prop) :FieldConfig{
    let fieldConfig: FieldConfig = {
      key: key,
      fieldType: 'unkown',
      label: prop['title'],
      validators: [],
      value: null
    }
    let ft = prop['type'];
    if ('minimum' in prop){
      fieldConfig.validators.push(Validators.min(prop['minimum']));
    }
    if ('maximum' in prop){
      fieldConfig.validators.push(Validators.max(prop['maximum']));
    }
    if ('minLength' in prop){
      fieldConfig.validators.push(Validators.minLength(prop['minLength']));
    }
    if ('maxLength' in prop){
      fieldConfig.validators.push(Validators.maxLength(prop['maxLength']));
    }
    if ('value' in prop){
      fieldConfig.value = prop['value'];
    }
    switch (ft) {
      case 'string':
        if ('format' in prop){
          switch(prop['format']){
            case 'date-time':
              fieldConfig.fieldType = 'datetimefield';
              if (fieldConfig.value = ''){
                fieldConfig.value = new Date();
              }
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
        else if('maxLength' in prop){
          fieldConfig.fieldType = 'stringfield';
        }
        else{
          fieldConfig.fieldType = 'textareafield';
        }
        break;
      case 'boolean':
        fieldConfig.fieldType = 'booleanfield'
        fieldConfig.value = false;
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

@Injectable()
export class DynamicFormService {
  private modals = {};

  constructor(
  ) {
  }


  showModalSubForm(sfkey) {
    let modal = this.modals[sfkey];
    console.log('Show modal', modal);
    console.log('Resetting', modal._component);
    modal._component.reset();
    modal.present();
  }

  showSubForm(sfkey) {
    return this.showModalSubForm(sfkey);
  }


  mapJSONSchema(schema): {[s: string]: FormConfig}{
    let conv = new FormConverter(schema);
    return conv.getForms();
  }

}
