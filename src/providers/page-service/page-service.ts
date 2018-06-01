import { Injectable } from '@angular/core';
import { StorageService } from '../storage-service/storage-service';
import { Subject }    from 'rxjs';
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
  private active: boolean = true;

  constructor(private storageService: StorageService) {
  }

  public deactivate(){
    this.active = false;
  }

  public getDatasets(){
    console.log("Getting datasets", this.datasets);
    return this.datasets;
  }
  
  public initialize(){
    console.log("Initializing");
    this.active = true;
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
      console.log("Attempting websocket connection");
      this.storageService.createSocket();
      this.authenticated = value[0]!==undefined;
      this.jwt = value[0];
      this.datasets = value[1];
      console.log("Ready");
      this.ready.next();
    });
  }

  isAuthenticated() {
    return this.authenticated;
  }



}
