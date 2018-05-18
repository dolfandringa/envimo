import { Component } from '@angular/core';
import { PageService } from '../../providers/page-service/page-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{

  constructor(
    public pageService: PageService) {
    this.pageService.pagetitle = 'Home';
  }

}
