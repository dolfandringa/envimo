import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FieldService } from '../../app/field.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FieldService]
})
export class HomePage {
  fields: any[];
  pagetitle: string = 'Home';

  constructor(public navCtrl: NavController, public service: FieldService) {
    this.fields = service.getFields();
    console.log("navParams: ",this.navParams);
  }

}
