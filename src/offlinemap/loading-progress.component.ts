import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'loading-progress',
  template: '<ion-content><progress-bar [show_percentage]="true" [max]="max" [status]="progress"></progress-bar><div class="title">{{title}}</div></ion-content>',
  styles: [
    'ion-content { height: 100%; }',
    '.title { text-align: center; font-size: 1.3em;}',
    'progress-bar { height: 50% }'
  ]
})
export class LoadingProgress{

  private title: string;
  private progress: number = 0;
  private max: number = 100;

  constructor(
    params: NavParams,
    viewCtrl: ViewController
  ) { 
    this.title = params.get('title');
    this.max = params.get('max');
    params.get('inc').subscribe((perc) => {
      this.progress += perc;
      //console.log("Increasing progress to", this.progress);
    });
  }

  public dismiss() {
  }

}
