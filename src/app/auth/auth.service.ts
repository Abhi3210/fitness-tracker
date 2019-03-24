import { Injectable } from '@angular/core';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject }  from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import { TrainingService } from '../training/training.service';
import { UiService } from './../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
 // authChange=new Subject<boolean>();
    private user:User;
    private fbSubs: Subscription[]=[];
  //private isAuthentiCated = false;

  constructor(
    private router:Router , 
    private afAuth: AngularFireAuth , 
    private db: AngularFirestore ,
    private trainingService : TrainingService,
    private uiService : UiService,
    private store : Store<fromRoot.State>
    ) { }

  registerUser(authData:AuthData)
    {
          /* this.user={
            email:authData.email,
            userId: Math.round(Math.random()*10000).toString()
          }; */
       // this.uiService.loadingStateSchanged.next(true); 
        this.store.dispatch(new UI.StartLoading()) ;
        this.afAuth.auth.
        createUserWithEmailAndPassword(
          authData.email,
          authData.password)
        .then(result=>{
          // this.uiService.loadingStateSchanged.next(false);
          this.store.dispatch(new UI.StopLoading()) ;
          this.addDataToDatabase({
             email:authData.email,
             password:'xxxxxxxxxx',
             firstName:authData.firstName,
             lastName:authData.lastName,
             userId:this.afAuth.auth.currentUser.uid
          });
        })
        .catch(error=>{
          //this.uiService.loadingStateSchanged.next(false);
          this.store.dispatch(new UI.StopLoading()) ;
          this.uiService.showSnamckBar(error.message, null, 5000);
        });
    }

    login(authData:AuthData){
        /* this.user={
            email:authData.email,
            userId: Math.round(Math.random()*10000).toString()
          }; */
      // this.uiService.loadingStateSchanged.next(true);
       this.store.dispatch(new UI.StartLoading()) ;
       this.afAuth.auth.
       signInWithEmailAndPassword(authData.email,authData.password)
       .then(result=>{
        //this.uiService.loadingStateSchanged.next(false);
        this.store.dispatch(new UI.StopLoading()) ;
      })
      .catch(error=>{
        //this.uiService.loadingStateSchanged.next(false);
        this.store.dispatch(new UI.StopLoading()) ;
        this.uiService.showSnamckBar(error.message, null, 5000);
      });    
    }

    initAuthListener(){
      this.afAuth.authState.subscribe(user=>{
       if(user){
        //this.isAuthentiCated=true;
        //this.authChange.next(true); 
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['']);
       } 
       else{
        this.trainingService.cancelSubscriptions();
        //this.authChange.next(false);
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
        //this.router.navigate(['']);
        //this.isAuthentiCated=false;
       }
      });
    }

    logout()
    {   
        this.afAuth.auth.signOut();
        this.uiService.showSnamckBar('You have successfully logged out', null, 5000);
    }

    private addDataToDatabase(authData : AuthData){
      this.db.collection('users').add(authData);
    }

   

    /* getUser()
    {
        return {...this.user};
    } */

 /*    isAuth()
    {
       // return this.user !=null;
       return this.isAuthentiCated;
    } */
    
    
}
