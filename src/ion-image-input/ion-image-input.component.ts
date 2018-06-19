import { Component, forwardRef } from '@angular/core';
import { Platform, LoadingController, ToastController, ActionSheetController, Loading } from 'ionic-angular';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the IonImageInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

declare var cordova: any;

@Component({
  selector: 'ion-image-input',
  templateUrl: 'ion-image-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonImageInputComponent),
      multi: true
    }
  ]
})
export class IonImageInputComponent implements ControlValueAccessor {

  _lastImage: string = null;
  loading: Loading;
  propagateChange = (_: any) => {};

  constructor(
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private platform: Platform,
  ) { }

  private presentToast(message: string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  get lastImage(): string{
    return this._lastImage;
  }

  set lastImage(val) {
    this._lastImage = val;
    this.propagateChange('file://'+this._lastImage);
  }

  writeValue(value: any){
    this.lastImage = value;
  }

  registerOnTouched() { }


  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  public chooseSource() {
    let actionsheet = this.actionSheetCtrl.create({
      title: 'Choose Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel;'
        }
      ]
    });
    actionsheet.present();
  }

  getPicture(sourceType){
    let options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    let correctPath: string;
    let currentName: string;

    this.camera.getPicture(options).then((imagePath) => {
      if(this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath).then(filePath => {
          correctPath = filePath.substr(0, filePath.lastIndexOf('/') +1);
          currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
      }
      else {
        currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
        this.presentToast('Error while selecting image.');
    });
  }

  private createFileName() {
    let d = new Date(),
    n = d.getTime(),
    newFileName = n + '.jpg';
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast("Error while storing file.");
    });
  }

  public pathForImage(img){
    if (img === null){
      return '';
    }
    else{
      return cordova.file.dataDirectory + img;
    }
  }

}
