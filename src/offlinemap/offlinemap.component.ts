import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import leaflet from 'leaflet';
import 'leaflet-offline';
import { TilesDbProvider } from './tiles-db';
import { AlertController, ModalController, Modal } from 'ionic-angular';
import { LoadingProgress } from './loading-progress.component';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

var locateControl = leaflet.Control.extend({
  options: {
    position: 'topleft',
    maxZoom: 15
  },
  initialize: function(options) {
    leaflet.Util.setOptions(this, options);
  },
  icon: leaflet.icon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  }),
  setMarker: function(loc){
    if(typeof this.marker != 'undefined'){
      this._map.removeLayer(this.marker);
    }
    this.marker = leaflet.marker([loc.lat, loc.lng], { icon: this.icon, draggable: true });
    leaflet.DomEvent.on(this.marker, 'dragend', function(e){
      this._map.fire('locationchanged', {location: e.target.getLatLng()});
    }, this);
    this.marker.addTo(this._map);
    this._map.fire('locationchanged', {location: this.getLocation()});
  },
  marker: undefined,
  locateMe: function(){
    //var self = this;
    console.log('locating me on map', this._map);
    

    let evt = this._map.locate({
      setView: true,
      maxZoom: this.options.maxZoom
    });
    leaflet.DomEvent.on(evt, 'locationfound', function(e) {
      this.setMarker({lat: e.latitude, lng: e.longitude});
    }, this)
    leaflet.DomEvent.on(evt, 'locationerror', function (err) {
      this._map.fire('geolocationerror', {message: err.message});
      this.setMarker(this._map.getCenter());
    }, this);
  },

  getLocation: function() {
    if(typeof this.marker != 'undefined'){
      return this.marker.getLatLng();
    }
  },

  onAdd: function (map){
    this.markerLayer = leaflet.layerGroup();
    this.markerLayer.addTo(this._map);
    
    let container = leaflet.DomUtil.create('a', 'leaflet-bar enable-hover leaflet-control leaflet-control-custom');
    container.setAttribute('ion-button','');
    container.setAttribute('icon-only','');
    container.style.width = '34px';
    container.style.height = '34px';
    container.style.display = 'block';
    container.style.backgroundColor = 'white';
    container.innerHTML = '<span style="color: black; line-height: 30px; display: inline-block;width: 100%;text-align: center" class="icon icon-md ion-md-locate"></span>';


    leaflet.DomEvent.disableClickPropagation(container);
    leaflet.DomEvent.on(container, 'click', leaflet.DomEvent.stop);
    leaflet.DomEvent.on(container, 'click', this.locateMe, this);
    leaflet.DomEvent.on(container, 'click', this._refocusOnMap, this);
    return container;
  }
});

//leaflet.control.locate = new leaflet.Control.locateControl;

@Component({
  selector: 'offlinemap',
  templateUrl: 'offlinemap.component.html'
})
export class OfflineMap implements OnInit, AfterViewInit{
  @ViewChild('_map') mapContainer: ElementRef;
  @Output() locationChanged: EventEmitter<{lat: number, lng: number}> = new EventEmitter<{lat: number, lng: number}>();

  map: any;
  locCtrl: any;
  private loading: Modal;
  private loadingDestroy: Subject<boolean> = new Subject<boolean>();


  @Input() minZoom: number = 12
  @Input() maxZoom: number = 15;
  @Input() autoLoad: boolean = true;

  constructor(
    private tilesDb: TilesDbProvider,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {

  }

  ngOnInit(){
  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  
  showConfirm(title, message, handler) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Ok', 
          handler: handler
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  load() {
    console.log('loading map');

    this.loading = this.modalCtrl.create(
      LoadingProgress,
      {
        'title': 'Downloading map data...',
        max: 100,
        inc: this.tilesDb.progressed
      },
      { 
        enableBackdropDismiss: false,
        cssClass: 'loadingModal'
      });
    
    let tileurl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    
    this.map = leaflet.map("_map", {
      tap: false,
      zoomAnimation: false,
      markerZoomAnimation: false
    }).fitWorld();
    let lyr = leaflet.tileLayer.offline(tileurl, this.tilesDb, {
      crossOrigin: true
    })
    let ctrl = leaflet.control.offline(lyr, this.tilesDb, {
      saveButtonHtml: '<span class="icon icon-md ion-md-download"></span>',
      removeButtonHtml: '<span class="icon icon-md ion-md-trash"></span>',
      confirmSavingCallback: (nTilesToSave, continueSaveTiles) => {
        this.showConfirm('Save', 'Are you sure you want to save '+nTilesToSave+' tiles?', continueSaveTiles);
      },
      confirmRemovalCallback: (continueRemoveTiles) => {
        this.showConfirm('Remove', 'Are you sure you want to remove all saved background map data?', continueRemoveTiles);
      },
      minZoom: this.minZoom,
      maxZoom: this.maxZoom
    });
    lyr.addTo(this.map);
    ctrl.addTo(this.map);
    this.locCtrl = new locateControl({maxZoom: this.maxZoom})
    this.map.addControl(this.locCtrl);

    lyr.on('offline:below-min-zoom-error', () => {
      this.showAlert('Zoom Error', "You zoomed out too far. We can't download this much map data. Please zoom in further.");
    });
    lyr.on('offline:save-start', (data) => {
      console.log('Saving',data.nTilesToSave,'tiles.');
      this.loading.present().then(() => {
        this.tilesDb.done.takeUntil(this.loadingDestroy)
          .subscribe((result) => {
            console.log("Successfully downloaded",result.succeeded);
            console.log("Failed to downloaded",result.failed);
            this.loading.dismiss();
            this.loadingDestroy.next(true);
          });
      });

    });
    lyr.on('offline:save-end', () => {
      console.log('Finished saving tiles.');
    });
    lyr.on('offline:save-error', (err) => {
      console.log('Error saving tiles:', err);
    });
    lyr.on('offline:remove-start', () => {
      console.log('Removing all tiles.');
    });
    lyr.on('offline:remove-end', () => {
      console.log('Finished removing tiles.');
    });
    lyr.on('offline:remove-error', (err) => {
      console.log('Error removing tiles:', err);
    });
    this.map.on('locationchanged', (e) => {
      console.log('Location changed to', e.location);
      this.locationChanged.emit(e.location);
      console.log('Emitted locationChanged');
    });
    this.map.on('geolocationerror', (e) => {
      console.error('Geolocation error', e);
    });
    this.map.on('zoomend', (e) => {
      console.log('Zoomed to', e.target.getZoom());
    });
    
  }

  locateMe(){
    this.locCtrl.locateMe();
  }

  ngAfterViewInit(){
    console.log('afterviewinit');
    if(this.autoLoad){
      console.log("Autoloading map");
      this.load();
      this.locCtrl.locateMe();
    }
  }

}
