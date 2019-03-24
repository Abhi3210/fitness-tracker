import { Component, OnInit ,ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Exercise } from './../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription , Observable } from 'rxjs';
import { UiService } from './../../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit , AfterViewInit  {
   
  displayedColumns = ['date','name','calories','duration','state'];
  dataSource = new MatTableDataSource<Exercise>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 // private exChangedSubsription : Subscription;
 // private loadingSubscription : Subscription;
  //isLoading = false;
  isLoading$ : Observable<boolean>;

  constructor(
    private trainingService : TrainingService , 
    private uiService : UiService ,
    private store : Store<fromTraining.State>
    ) { }

  ngOnInit() {
   /* this.loadingSubscription = this.uiService.loadingStateSchanged.
   subscribe(isLoading=>{
     this.isLoading = isLoading;
   }); */
   this.isLoading$ = this.store.select(fromRoot.getIsLoading);
   this.store.select(fromTraining.getFinishedExercises)
   .subscribe((exercises : Exercise[])=>{
    this.dataSource.data=exercises;
   });
   

  /*  this.exChangedSubsription = this.trainingService.finishedexercisesChanged
    .subscribe((exercises : Exercise[])=>{
      this.dataSource.data=exercises;
    }); */

    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  
  doFilter(filterValue : string){
     this.dataSource.filter=filterValue.trim().toLocaleLowerCase();
  }

  /* ngOnDestroy(){
     if(this.exChangedSubsription){
      this.exChangedSubsription.unsubscribe();
     }
     if(this.loadingSubscription){
      this.loadingSubscription.unsubscribe();
     }
  } */
}
