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
  queueLength: number = 0;
  progress: number = 0;

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

  public exportQueue(){
    this.storageService.exportQueue();
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
    console.log('Subscribing to JWTLoginError');
    this.storageService.JWTLoginError
      .takeWhile(() => this.active)
      .subscribe((error: string) => {
        console.log('Got a login error');
        this.loginError.next();
      });

    this.storageService.queueChange
      .takeWhile(() => this.active)
      .subscribe((newLength: number) => {
        console.log("Queuelength changed to", newLength);
        if(newLength>this.queueLength){
          this.queueLength = newLength;
        }
        this.progress = this.queueLength - newLength;
      });
    this.storageService.newDatasetsAvailable
      .takeWhile(() => this.active)
      .subscribe(() => {
        console.log("New datasets available. Getting them now.");
        this.datasets = this.storageService.getDatasets();
        console.log('New datasets', this.datasets);
        this.newDatasetsAvailable.next();
      });
    this.storageService.initialize().then(() => {;
      let jwt = this.storageService.getJWT();
      let datasets = this.storageService.getDatasets();
      console.log("Finished initializing. jwt", jwt, "datasets", datasets);
      this.jwt = jwt;
      this.authenticated = this.jwt!==undefined && this.jwt != null;
      //if(value[0] == null || value[0] === undefined){
        //this.loginError.next();
      //}
      this.datasets = datasets;
      console.log("Ready. Authenticated?", this.authenticated, "Connection available?", this.connectionAvailable);
      if(this.connectionAvailable && this.authenticated){
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
