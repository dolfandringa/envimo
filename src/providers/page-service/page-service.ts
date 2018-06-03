import { Injectable } from '@angular/core';
import { StorageService } from '../storage-service/storage-service';
import { Platform } from 'ionic-angular';
import { Subject }    from 'rxjs';
import { Network } from '@ionic-native/network';
import "rxjs/add/operator/takeWhile";


/*
  Generated class for the PageService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PageService {
  pagetitle: string;
  authenticated: boolean;
  datasets: object;
  jwt: string;
  ready = new Subject<null>();
  newDatasetsAvailable = new Subject<null>();
  loginError = new Subject<null>();
  queueLength: number;

  private _ready: boolean = false;
  private connectionAvailable: boolean = false;
  private active: boolean = true;

  constructor(
    private storageService: StorageService,
    private network: Network,
    private platform: Platform,
  ) {
    this.ready.subscribe(() => {
      this._ready = true
    });
    network.onConnect()
      .subscribe(() => {
        console.log("Network connection active");
        this.connectionAvailable = true;
        if(this._ready && this.active){
          console.log("Attempting websocket connection");
          this.storageService.createSocket();
        }
      });
  }

  checkOnline(){
    console.log("Network type", this.network.type);
    if(this.platform.is('cordova')){
      if(this.network.type != 'none' && this.network.type != 'unkown'){
        console.log("Connection already active");
        this.connectionAvailable = true;
      }
    }
    else{
       this.connectionAvailable = navigator.onLine;
    }
    console.log("Are we online:", this.connectionAvailable)
  }

  public deactivate(){
    this.active = false;
  }

  public getDatasets(){
    console.log("Getting datasets", this.datasets);
    return this.datasets;
  }

  public saveData(datasetname, formname, data){
    return this.storageService.storeData(datasetname, formname, data);
  }
  
  public initialize(){
    console.log("Initializing");
    this.checkOnline()
    this._ready = false;
    this.active = true;
    this.storageService.getQueueLength().then((queueLength: number) => {
      console.log("Queue length:", queueLength);
      this.queueLength = queueLength;
    });
    this.storageService.JWTLoginError
      .takeWhile(() => this.active)
      .subscribe((error: string) => {
        console.log('Got a login error');
        this.loginError.next();
      });
    this.storageService.newDatasetsAvailable
      .takeWhile(() => this.active)
      .subscribe(() => {
        console.log("New datasets available. Getting them now.");
        this.storageService.getDatasets().then((datasets) => {
          console.log('New datasets', datasets);
          this.datasets = datasets;
          this.newDatasetsAvailable.next();
        });
      });
    Promise.all([
      this.storageService.getJWT(),
      this.storageService.getDatasets(),
    ]).then(value => {
      console.log("Finished initializing. jwt", value[0], "datasets", value[1]);
      this.authenticated = value[0]!==undefined;
      this.jwt = value[0];
      this.datasets = value[1];
      console.log("Ready");
      if(this.connectionAvailable){
        console.log("Attempting websocket connection");
        this.storageService.createSocket();
      }
      this.ready.next();
    });
  }

  isAuthenticated() {
    return this.authenticated;
  }



}
