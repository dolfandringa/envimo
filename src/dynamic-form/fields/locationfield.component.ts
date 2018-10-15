import { ViewChild, Component, AfterViewInit } from '@angular/core';
import { BaseFieldComponent } from './basefield.component';
import { OfflineMap } from '../../offlinemap/offlinemap.component';
 

@Component({
  selector: 'location-field',
  styles: ['offlinemap { display: block; width: 400px; height: 400px;}'],
  template: `
<ion-item>
  <offlinemap id="myofflinemap" [autoLoad]="false" (locationChanged)="locationChanged($event)"></offlinemap>
</ion-item>
  `
})
export class LocationFieldComponent extends BaseFieldComponent implements AfterViewInit {
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

  loadFinalize() {
    console.log('LocationField loadFinalize');
    super.loadFinalize();
    this.loadMap();
  }

  ngAfterViewInit() {
    console.log('Location field AfterViewInit. Document:', document.getElementById('_map'));
  }

}
