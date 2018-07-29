import { ViewChild, Component } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';
import { OfflineMap } from '../../offlinemap/offlinemap.component';
 

@Component({
  selector: 'location-field',
  styles: ['offlinemap { display: block; width: 200px; height: 200px;}'],
  template: `
<ion-item>
  <offlinemap [autoLoad]="false" (locationChanged)="locationChanged($event)"></offlinemap>
  <button (click)="loadMap()" ion-button outline color="primary">Load map</button>
</ion-item>
  `
})
export class LocationFieldComponent extends BaseFieldComponent {
  @ViewChild(OfflineMap) map: OfflineMap;
  locationChanged(location){
    console.log('Changing form location');
    console.log("Config:", this.config)
    this.formGroup.controls[this.config['lat_key']].setValue(location.lat);
    this.formGroup.controls[this.config['lon_key']].setValue(location.lng);
    console.log('formGroup', this.formGroup);
  }
  loadMap(){
    this.map.load();
    this.map.locateMe();
  }

}
