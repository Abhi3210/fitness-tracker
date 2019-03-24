import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './../auth.service';
import { UiService } from './../../shared/ui.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { map } from 'rxjs/operators';
import * as UI from '../../shared/ui.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {
  
  loginForm: FormGroup;
  // isLoading = false;
  isLoading$ : Observable<boolean>;
  private loadingSubscription : Subscription;

  constructor(
    private authService:AuthService, 
    private uiService: UiService,
    private store : Store<fromRoot.State>
    ) { }

  ngOnInit() {
   // this.isLoading$ = this.store.pipe(map(state=> state.ui.isLoading));
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    /* this.loadingSubscription = this.uiService.loadingStateSchanged
    .subscribe(isLoading=>{
       this.isLoading = isLoading;
    }); */

    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  /* ngOnDestroy(){
    if(this.loadingSubscription){
      this.loadingSubscription.unsubscribe();
    } */
    
  }


