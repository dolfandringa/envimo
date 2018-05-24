import { Socket } from 'ng-socket-io';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FieldBase }     from '../dynamic-form-field/base';
import { DynamicForm }     from '../dynamic-form/base';
import { FieldDateTime, FieldMultipleDropdown, FieldDropdown, FieldTextbox, FieldInteger, FieldNumber } from '../dynamic-form-field/field-types';
import { FieldImageUpload } from '../dynamic-form-field/field-types';
import { Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import { Camera } from '@ionic-native/camera';
import { DynamicSubFormComponent } from './dynamic-subform.component';
import { ModalController } from 'ionic-angular';

@Injectable()
export class DynamicFormService {
  public forms = {};
  public currentForm: DynamicForm;
  private modals = {};

  constructor(
    private socket: Socket,
    private camera: Camera,
    public modalCtrl: ModalController
  ) {
    console.log("Started dynamic form service");
    this.onConnect().subscribe(data => {
      console.log('Connected');
      this.socket.emit("message", "Hello World!");
    });
    console.log('Connecting to websocket');
    this.socket.connect();
    //let fields = this.getFields();
    //this.forms["someform"] = new DynamicForm('observation', 'Add Observation', fields);
  }

  getDefinition(schema :object, ref :string) :[string, object]{
    let defname = ref.split('/').pop()
    console.log('Getting definition for ', defname,': ',schema['definitions'][defname]);
    return [defname, schema['definitions'][defname]];
  }

  addSubForm(sfkey, data) {
    this.modals[sfkey] = this.modalCtrl.create(DynamicSubFormComponent, data);
  }


  showSubForm(sfkey) {
    this.modals[sfkey].present();
  }

  getDatasets(){
    return this.socket.fromEvent("newDatasets").map(data => { 
      let datasets = {};
      console.log("Got datasets", data);
      for (let dskey in data){
        datasets[dskey] = this.mapJSONSchema(data[dskey]);
      }
      console.log("Resulting datasets", datasets);
      return datasets;
    });
  }

  mapJSONForm(formschema, formkey, mainschema): DynamicForm{
    let form = new DynamicForm(formkey, formschema['title'], new Array());
    for (let propkey in formschema['properties']){
      let prop = formschema['properties'][propkey];
      let field: FieldBase;
      if (prop['type'] == 'array' || 'enum' in prop){
        let retval = this.mapSelectField(propkey, prop, mainschema);
        field = retval[1];
        console.log('Retval', retval);
        for (let sfkey in retval[0]){
          console.log("Subform", retval[0][sfkey])
          form.subforms[sfkey] = retval[0][sfkey];
        }
      }
      else if('contentMediaType' in prop){
        field = this.mapMediaField(propkey, prop);
      }
      else{
        field = this.mapSimpleField(propkey, prop);
      }
      console.log("Field", field);
      form.fields.push(field);
    }
    return form;
  }

  mapJSONSchema(schema){
    let forms = {};
    for (let formkey in schema['properties']){
      let formschema: object;
      if('$ref' in schema['properties'][formkey]){
        let ref = schema['properties'][formkey]['$ref'];
        formschema = this.getDefinition(schema, ref)[1];
      }
      else{
        formschema = schema['properties'][formkey];
      }
      console.log("Formschema", formschema);
      let form = this.mapJSONForm(formschema, formkey, schema);
      forms[formkey] = form;
    }
    return forms;
  }

  mapMediaField(key, prop): FieldBase{
    console.log('Mapping media field', key, 'with properties', prop);
    let field: FieldBase;
    let options = {
      key: key,
      label: prop['title'],
      validators: [],
      contentMediaType: prop['contentMediaType'],
      contentEncoding: prop['contentEncoding']
    }
    if (['image/png', 'image/jpeg'].indexOf(prop['contentMediaType'])>-1){
      field = new FieldImageUpload(options, this.camera);
    }
    return field;
  }
  
  mapSelectField(key, prop, schema) :[object, FieldBase]{
    let field: FieldBase;
    let subforms = {};
    let options = {
      key: key,
      label: prop['title'],
      options: [],
      validators: [],
      subforms: []
    };
    if (prop['type'] == 'array'){
      for (let ikey in prop['items']){
        let item = prop['items'][ikey];
        if('$ref' in item){
          let ref = item['$ref'];
          let subschema = this.getDefinition(schema, ref);
          let subform = this.mapJSONForm(subschema[1], subschema[0], schema);
          subforms[subschema[0]]=subform;
          options['subforms'].push(subschema[0]);
        }
        else{
          options['options'].push(item);
        }
      }
      field = new FieldMultipleDropdown(options);
    }
    else{ 
      if ('enum' in prop){
        options['options'] = prop['enum'];
      }
      field = new FieldDropdown(options);
    }
    return [subforms, field];
  }

  mapSimpleField(key, prop) :FieldBase{
    let fieldtype: typeof FieldBase;
    let base_props = {
      key: key,
      label: prop['title'],
      validators: []
    }
    let ft = prop['type'];
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
              base_props.validators.push(Validators.email);
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
    let fields: FieldBase[] = [
      new FieldMultipleDropdown({
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

  onConnect(){
    let obs = new Observable(observer => {
      this.socket.on('connect', (data) => {
        observer.next(data);
      });
    });
    return obs;
  }

}
