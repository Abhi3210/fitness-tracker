import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  loadingStateSchanged = new Subject<boolean>();

  constructor(private matSnackBar : MatSnackBar) { }

  showSnamckBar(message , action , duration){
    this.matSnackBar.open(message , action ,{
      duration : duration
    })
  }
}
