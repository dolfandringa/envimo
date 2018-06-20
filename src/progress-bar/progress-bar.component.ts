import { Component, Input } from '@angular/core';


@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.component.html',
})
export class ProgressBarComponent {

  private _max: number = 0;
  private _status: number = 0;
  private percentage: number = 0;
  public show_percentage: boolean = false;

  constructor() { }

  get max(): number{
    return this._max;
  }

  @Input('max') 
  set max(value: number){
    this._max = value;
    this.updatePercentage();
  }

  get status(): number{
    return this._status;
  }

  @Input('status')
  set status(value: number){
    this._status = value;
    this.updatePercentage();
  }

  private updatePercentage(){
    if(this._max>0){
      this.percentage = this._status/this._max*100;
    }
    else{
      this.percentage = 100;
    }
  }
}
