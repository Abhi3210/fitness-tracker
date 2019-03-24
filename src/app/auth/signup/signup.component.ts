import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './../auth.service';
import { UiService } from 'src/app/shared/ui.service';
import { Subscription , Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit  {

  maxDate;
  isLoading$ : Observable<boolean>;
  //private isLoadingSubscription : Subscription;

  constructor(
    private authService:AuthService , 
    private uiService : UiService ,
    private store : Store<fromRoot.State>
    ) { }

  ngOnInit() {
    /* this.isLoadingSubscription = this.uiService.loadingStateSchanged.
    subscribe(isLoading=>{
      this.isLoading = isLoading;
    }); */
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.maxDate=new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  onSubmit(form:NgForm)
  { 
    this.authService.registerUser({
        email:form.value.email,
        password:form.value.password,
        firstName:form.value.firstName,
        lastName:form.value.lastName
    });

  }

  /* ngOnDestroy(){
    if(this.isLoadingSubscription){
      this.isLoadingSubscription.unsubscribe();
    }
    
  } */

}
