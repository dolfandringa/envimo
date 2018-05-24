import { FieldBase } from  './base';
import { Camera, CameraOptions } from '@ionic-native/camera';

export class FieldDropdown extends FieldBase{
  controlType = 'dropdown';
  options: {'key': string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}

export class FieldImageUpload extends FieldBase {
  controlType = 'imageupload';
  cameraoptions: CameraOptions;  
  constructor(options: {} = {}, camera: Camera){
    super(options);
    this.camera = camera;
    this.cameraoptions = {
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG
    };

    switch (options['contentMediaType']){
      case 'image/jpeg':
        this.cameraoptions['encodingType'] = this.camera.EncodingType.JPEG;
        break;
      case 'image/png':
        this.cameraoptions['encodingType'] = this.camera.EncodingType.PNG;
        break;
    }
  }
}

export class FieldMultipleDropdown extends FieldBase{
  controlType = 'multipledropdown';
  options: {'key': string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
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
