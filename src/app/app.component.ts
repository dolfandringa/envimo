import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PageService } from '../providers/page-service/page-service';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class EnviMo {
  @ViewChild(Nav) nav: Nav;


  public pagetitle = 'Home';
  rootPage:any = HomePage;

  pages: Array<{title: string, component: any, args: any}> = [{title: 'Home', component: HomePage, args: {}}]

  constructor(public platform: Platform, public pageService: PageService, 
              public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
  }

  updateMenu() {
    console.log('Updating menu');
    this.pages = [];
    let dss = this.pageService.getDatasets();
    console.log('Datasets:', dss);
    for(let k in dss){
      this.pages.push({title: k, component: HomePage, args: {dataset: k}});
      console.log("Dataset", k, dss[k]);
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.pageService.ready.subscribe(() => {
        this.updateMenu();
      });
      this.pageService.newDatasetsAvailable.subscribe(() => {
        this.updateMenu();
      });
    });
  }

  openPage(page) {
    //this.nav.push(page.component, page.args);
    this.nav.setRoot(page.component, page.args);
  }
}
