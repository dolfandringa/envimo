import { FieldBase } from  './base';

export class FieldDropdown extends FieldBase{
  controlType = 'dropdown';
  options: {'key': string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}

export class FieldMultipleDropdown extends FieldBase{
  controlType = 'multipledropdown';
  subforms: string[];
  options: {'key': string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
    this.subforms = this.options['subforms'];
  }
}

export class FieldTextbox extends FieldBase {
  controlType = 'textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class FieldDateTime extends FieldBase {
  controlType = 'datetime';
  type: string;

  constructor(options: {} = {}) {
    super(options);
  }
}

export class FieldInteger extends FieldBase {
  controlType = 'textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = 'number';
  }
}

export class FieldNumber extends FieldBase {
  controlType = 'textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = 'number';
  }
}
