import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from './../../auth/auth.service';
import { Subscription , Observable} from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit{
   
  @Output() sidenavClose=new EventEmitter<void>();
  //isAuth=false;
  isAuth$ : Observable<boolean>;
  authSubscription:Subscription;

  constructor(private authService:AuthService ,private store : Store<fromRoot.State>) { }

  ngOnInit() {
  /*  this.authSubscription= this.authService.authChange.subscribe(authStatus=>{
        this.isAuth=authStatus;
    }); */
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
  }
   
  onClose()
  {
     this.sidenavClose.emit();
  }

  onLogout(){
    this.authService.logout();
  }

  /* ngOnDestroy(){
    if(this.authSubscription){
      this.authSubscription.unsubscribe();
    }
  } */
}
