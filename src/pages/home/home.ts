import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FieldService } from '../../app/field.service';
import { PageService } from '../../providers/page-service/page-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FieldService]
})
export class HomePage {
  fields: any[];

  constructor(public navCtrl: NavController, public service: FieldService, public pageService: PageService) {
    this.fields = service.getFields();
    this.pageService.pagetitle = 'Home';
  }

}
