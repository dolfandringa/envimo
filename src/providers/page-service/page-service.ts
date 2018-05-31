import { Injectable } from '@angular/core';
import { StorageService } from '../storage-service/storage-service';
import { Subject }    from 'rxjs';


/*
  Generated class for the PageService provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PageService {
  pagetitle: string;
  authenticated: boolean;
  ready = new Subject<null>();
  newDatasetsAvailable = new Subject<null>();
  datasets: object;
  jwt: string;

  constructor(private storageService: StorageService) {
    this.initialize();
  }

  public getDatasets(){
    console.log("Getting datasets", this.datasets);
    return this.datasets;
  }
  
  public initialize(){
    console.log("Initializing");
    Promise.all([
      this.storageService.getJWT(),
      this.storageService.getDatasets(),
    ]).then(value => {
      console.log("Finished initializing");
      this.authenticated = value[0]!==undefined;
      this.jwt = value[0];
      this.datasets = value[1];
      this.storageService.newDatasetsAvailable.subscribe(() => {
        this.storageService.getDatasets().then((datasets) => {
          console.log('New datasets', datasets);
          this.datasets = datasets;
          this.newDatasetsAvailable.next();
        });
      });
      this.ready.next();
    });
  }

  isAuthenticated() {
    return this.authenticated;
  }



}
