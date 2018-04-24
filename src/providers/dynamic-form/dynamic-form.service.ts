import { Socket } from 'ng-socket-io';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FieldBase }     from '../fields/field-base';
import { FieldDateTime, FieldMultipleDropdown, FieldDropdown, FieldTextbox, FieldInteger, FieldNumber } from './field-types';
import { FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/map';

@Injectable()
export class DynamicFormService {
  public forms = {};
  constructor(private socket: Socket) {
    console.log("Started dynamic form service");
    this.onConnect().subscribe(data => {
      console.log('Connected');
      this.socket.emit("message", "Hello World!");
    });
    this.onForms().subscribe(data => {
      console.log('Got new forms', data);
      this.forms = data;
    });
    console.log('Connecting to websocket');
    this.socket.connect();
  }

  getDefinition(schema :object, ref :string) :[string, object]{
    let defname = ref.split('/').pop()
    return [defname, schema['definitions'][defname]];
  }

  mapJSONSchema(schema){
    let forms = {};
    for(formkey in schema['properties']){
      let form = {};
      if('$ref' in schema['properties'][formkey]){
        ref = schema['properties'][formkey]['$ref'];
        formschema = this.getDefinition(schema, ref[1]);
      }
      else{
        formschema = schema['properties'][formkey];
      }
      form['title'] = formschema['title'];
      let formfields: FieldBase[] = new Array();
      form['fields'] = formfields;
      for(propkey in formschema['properties']){
        prop = formschema['properties'][propkey];
        let field: FieldBase;
        if (prop['type'] == 'array' || 'enum' in prop){
          field = this.mapSelectField(propkey, prop);
        }
        else{
          field = this.mapSimpleField(propkey, prop);
        }
        form['fields'].push(field);
      }
      forms[formkey] = form;
    }
    return forms;
  }

  mapSelectField(key, prop) :[object, FieldBase]{
    let field BaseField;
    let subforms = {};
    let options = {
      key: key,
      label: prop['title'],
      options: [],
      validators: []
    };
    if (prop['type'] == 'array'){
      for (item in prop['items']){
        if('$ref' in item){
          let ref = item['$ref'];
          let subschema = this.getDefinition(schema, ref);
          let subform = this.mapJSONSchema(subschema[1]);
          subforms[subschema[0]]=subform;
        }
        else{
          options['options'].push(item);
        }
      }
      if (subforms != {}){
        //TODO Add the subforms to the field.
      }
      field = FieldMultipleDropdown();
    }
    else{ 
      if ('enum' in prop){
        options['options'] = prop['enum'];
      }
      field = FieldDropdown(options);
    }
    return [subforms, field];
  }

  mapSimpleField(key, prop) :FieldBase{
    let fieldtype: FieldBase;
    let base_props = {
      key: key,
      label: prop['title'],
      validators: []
    }
    ft = prop['type'];
    if ('minimum' in prop){
      base_props.validators.push(Validators.min(prop['minimum']));
    }
    if ('maximum' in prop){
      base_props.validators.push(Validators.max(prop['maximum']));
    }
    if ('minLength' in prop){
      base_props.validators.push(Validators.min(prop['minLength']));
    }
    if ('maxLength' in prop){
      base_props.validators.push(Validators.max(prop['maxLength']));
    }
    switch (ft) {
      case 'string':
        if ('format' in prop){
          switch(prop['format']){
            case 'date-time':
              fieldtype = FieldDateTime;
              break;
            case 'email':
              fieldtype = FieldTextbox;
              base_props['type'] = 'email';
              base_props.validators.push(Validators.email());
              break;
          }
        }
        else{
          fieldtype = FieldTextbox;
        }
        break;
      case 'integer':
        fieldtype = FieldInteger;
        break;
      case 'number':
        fieldtype = FieldNumber;
        break;
    }
    let field = new fieldtype(base_props);
    return field;
  }
  
  getFields() {
    let fields: FieldBase<any>[] = [
      new FieldDropdown({
        key: 'species',
        label: 'Species',
        validators: [Validators.required],
        options: [
          {key: 'G', value: 'Green Turtle'},
          {key: 'OR', value: 'Olive Ridley Turtle'},
          {key: 'HB', value: 'Hawksbill Turtle'},
          {key: 'LH', value: 'Loggerhead Turtle'},
          {key: 'LB', value: 'Leatherback Turtle'}
        ],
        order: 1
      }),

      new FieldTextbox({
        key: 'ccl_cm',
        label: 'Curved Carapax Length (CCL) in cm',
        validators: [Validators.required, Validators.min(50), Validators.max(250)],
        type: 'text',
        order: 2
      })
    ];

    return fields.sort((a, b) => a.order - b.order);

  }

  onForms(){
    return this.socket.fromEvent("newForms");
  }

  onConnect(){
    let obs = new Observable(observer => {
      this.socket.on('connect', (data) => {
        observer.next(data);
      });
    });
    return obs;
  }

}
