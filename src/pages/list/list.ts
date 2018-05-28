import { PageService } from '../../providers/page-service/page-service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder }   from '@angular/forms';
import { DynamicFormService } from '../../providers/dynamic-form/dynamic-form.service';


/*@Component({
  selector: 'page-list',
  template: `
  <ion-content>
    Hallo
  </ion-content>
  `
})
export class ListPage{
  constructor(
    public pageService: PageService
  ) {
    this.pageService.pagetitle = "Dag";
  }
}
 */

@Component({
  selector: 'page-list',
  template:`
  <ion-content style="margin-top: 70px;">
  <form [formGroup]="group">
  <ion-item [formGroup]="group">
    <ion-label floating for="idfield">Number</ion-label>
    <ion-input type="text" id="idfield" formControlName="idfield"></ion-input>
  </ion-item>
  <ion-item [formGroup]="group">
    <ion-label floating for="selectfield">Dynamic dropdown</ion-label>
    <ion-select multiple id="selectfield" formControlName="selectfield">
      <ion-option *ngFor="let option of baseOptions" [value]="option.value">{{ option.label }}</ion-option>
    </ion-select>
  </ion-item>
  <button ion-button type="submit" [disabled]="!group.valid" (click)='onSubmit()'>Save</button>
  </form>
  </ion-content>
  `
})

export class ListPage implements OnInit{

  group: FormGroup;
  baseOptions = [{value: 1, label: 'Chris'}, {value: 2, label: 'Charlie'}]
  pagetitle: string = "Test Dynamic Options";

  constructor(
    public dfs: DynamicFormService,
    private fb: FormBuilder,
    public pageService: PageService,
  ) {
    this.pageService.pagetitle = this.pagetitle;
  }

  onSubmit(){
    console.log("Form value:",this.group.value);
  }

  ngOnInit(){
    this.group = this.createGroup();
    this.group.get('idfield').valueChanges.subscribe((value) => {
      console.log("selectfield value(s):", this.group.get('selectfield').value);
      console.log("idfield changed");
      this.dfs.getNewOptions(value).subscribe((newoptions) => {
        console.log("Got the following new options:", newoptions);
        for(let option of newoptions){
          this.baseOptions.push(option);
          this.group.get('selectfield').value.push(option.value);
        }
        console.log("New form value", this.group.value);
      });
    });
    this.group.get('selectfield').valueChanges.subscribe((value) => {
      console.log("Select field changed to", value);
    });
  }

  createGroup(){
    const group = this.fb.group({
      idfield: [''],
      selectfield: [[this.baseOptions[0].value, this.baseOptions[1].value]]
    });
    return group;
  }


}

