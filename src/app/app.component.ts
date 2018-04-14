import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

@Component({
  templateUrl: 'app.html'
})
export class PawikanMonitoring {
  @ViewChild(Nav) nav: Nav;


  public pagetitle = 'Home';
  rootPage:any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    this.pages = [
      {title: 'Home', component: HomePage},
      {title: 'List', component: ListPage}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log("pages: ", this.pages);
      console.log("nav: ", this.nav);
      console.log("nav active component: ", this.nav.getActive().getContent());
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
