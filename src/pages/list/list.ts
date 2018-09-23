import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit{

  public debugdata = {};
  public zeep: any;

  constructor( 
    public navCtrl: NavController,
    public navParams: NavParams,
    private file: File,
    private sharing: SocialSharing,
    private plt: Platform
  ) {
  }

  shareCordova(data){
    console.log('Sharing file');
    let ts = new Date().getTime().toString();
    console.log('ts',ts);
    let tempdir = this.file.dataDirectory+ts;
    console.log('tempdir', tempdir);
    let zfname = this.file.dataDirectory+'/'+'export-'+ts+'.zip';
    console.log('zfname', zfname);
    this.file.createDir(this.file.dataDirectory, ts, true).then(() => {
      let promises = new Array();
      for(let filename in data){
        promises.push(this.file.writeFile(tempdir, filename, data[filename]));
      }
      Promise.all(promises).then(() => {
        let zeep = (<any>window).Zeep;
        console.log('zeep', zeep);
        var self = this;
        zeep.zip({
          from: tempdir,
          to: zfname
        }, function(res) {
          console.log("Success", res);
          self.sharing.share('Please upload this file in the admin interface', 'Data exported', zfname, null).then(() => {
            self.file.removeRecursively(self.file.dataDirectory, ts);
            self.file.removeFile(self.file.dataDirectory, 'export-'+ts+'.zip');
            console.log("Done cleaning up");
          });
        }, function(err) {
          console.error("Error", err);
        });
      });
    });
  }

  shareWeb(data){
    console.log('Creating zip file');
    let f = new JSZip()
    let ts = new Date().getTime().toString();
    for(let filename in data){
      f.file(filename, data[filename]);
    }
    f.generateAsync({type: 'blob'}).then((blob) => {
      console.log('Finished creating zip file');
      saveAs(blob, "export-"+ts+".zip");
    });
  }

  ngOnInit(){
    let data = {'text.txt': 'Hello world\n', 'test2.txt': 'Bye cruel world!'};
    if(this.plt.is('cordova')){
      this.shareCordova(data);
    }
    else{
      this.shareWeb(data);
    }
  }

}

