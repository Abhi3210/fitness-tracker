import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import { Route } from '@angular/router';
import { take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor(
        private authService: AuthService ,
        private router: Router,
        private store : Store<fromRoot.State>
        ){}

    canActivate(route: ActivatedRouteSnapshot ,state: RouterStateSnapshot){
       /*  if(this.authService.isAuth()){
           return true;
        }
        else{
           this.router.navigate(['/login']);
        } */

        return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
    }

    canLoad(route : Route){
        return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
    }
}