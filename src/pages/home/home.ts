import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PageService } from '../../providers/page-service/page-service';
import { DynamicFormService } from '../../providers/dynamic-form/dynamic-form.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  fields: any[];
  forms: object;

  constructor(public navCtrl: NavController, public dfs: DynamicFormService, public pageService: PageService) {
    this.fields = dfs.getFields();
    this.pageService.pagetitle = 'Home';
  }

    

}
