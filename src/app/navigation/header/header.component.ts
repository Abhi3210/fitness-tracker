import { Component, OnInit , EventEmitter ,Output, OnDestroy } from '@angular/core';
import { AuthService } from './../../auth/auth.service';
import {Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() sidenavToggle=new EventEmitter<void>();
  //isAuth=false;
  isAuth$ : Observable<boolean>;
  authSubscription:Subscription;

  constructor(private authServie:AuthService, private store : Store<fromRoot.State>) { }

  ngOnInit() {
  /*  this.authSubscription=this.authServie.authChange.subscribe(authStatus=>{
        this.isAuth=authStatus;
    }); */
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
  }
   
  onToggleSidenav(){
       this.sidenavToggle.emit();
  }

  onLogout(){
    this.authServie.logout();
  }

  /* ngOnDestroy(){
      if(this.authSubscription){
        this.authSubscription.unsubscribe();
      }
  } */
}
