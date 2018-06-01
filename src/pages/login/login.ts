import { Component, OnInit } from '@angular/core';
import { LoadingController, Loading, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators }   from '@angular/forms';
import { PageService } from '../../providers/page-service/page-service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../providers/storage-service/storage-service';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit{

  loginForm: FormGroup;
  loginError: string;
  loading: Loading;

  constructor(
    private storageService: StorageService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    public pageService: PageService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
  ) {
  }
  
  valid(fieldname): boolean{
    return this.loginForm.get(fieldname).valid;
  }
  
  errors(fieldname){
    return this.loginForm.get(fieldname).errors;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  

  login(){
    this.loading = this.loadingCtrl.create({
      content: "Logging in. Please wait...",
    })
    this.loading.present().then(() => {
      this.http.post<object>('http://127.0.0.1:8080/login_app', this.loginForm.value).subscribe((data) => {
        console.log("Login result:", data);
        this.loading.dismiss();
        if(!data['success']){
          this.loginError = data['message'];
        }
        else{
          this.storageService.setJWT(data['token']).then(() => {
            this.navCtrl.pop();//push(HomePage,{},{direction: 'back'});
          });
        }
      });
    });
  }

  ngOnInit(){
    this.loginForm = this.fb.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]],
    });
  }

}
