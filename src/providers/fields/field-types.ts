import { FieldBase } from  './field-base';

export class FieldDropdown extends FieldBase<string>{
  controlType = 'dropdown';
  options: {'key': string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}

export class FieldMultipleDropdown extends FieldBase<string>{
  controlType = 'dropdown';
  options: {'key': string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}

export class FieldTextbox extends FieldBase<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class FieldDateTime extends FieldBase<string> {
  controlType = 'datetime';
  type: string;

  constructor(options: {} = {}) {
    super(options);
  }
}

export class FieldInteger extends FieldBase<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = 'number';
  }
}

export class FieldNumber extends FieldBase<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = 'number';
  }
}
