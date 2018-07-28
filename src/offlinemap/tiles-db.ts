import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the TilesDbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TilesDbProvider {
  @Output() done: EventEmitter<{failed: number, succeeded: number}> = new EventEmitter<{failed: number, succeeded: number}>();
  @Output() progressed: EventEmitter<number> = new EventEmitter<number>();
  
  private nTiles: number = 0;
  private nFailed: number = 0;

  constructor(private storage: Storage, private http: HttpClient) {
  }


  public saveTiles(tileUrls){
    let promises: Promise<any>[] = [];
    this.nTiles = tileUrls.length;
    for(let tileUrl of tileUrls){
      let prom = this.http.get(tileUrl.url, {responseType: "blob"})
        .toPromise()
        .then((data) => {
          return this.saveTile(tileUrl.key, data);
        })
        .catch((err) => {
          console.error(err);
          this.nFailed ++;
        });
      promises.push(prom);
    }
    return Promise.all(promises).then(() => {
      console.log("Done downloading");
      this.done.emit({failed: this.nFailed, succeeded: this.nTiles-this.nFailed});
    });
  }

  private saveTile(key, value): Promise<any>{
    return this.removeTile(key)
    .then(() => {
      return this.storage.set(key, value);
    }).then(() => {
      this.progressed.emit(1/this.nTiles*100);
    }).catch((err) => {
      console.error(err);
    });
  }

  private removeTile(key): Promise<any> {
    return this.storage.remove(key);
  }

  public getItem(key) {
    return this.storage.get(key);
  }

  public clear() {
    return this.storage.clear();
  }

}
