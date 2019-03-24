import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable , Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UiService } from './../../shared/ui.service';
import * as fromRoot from '../../app.reducer';
import * as fromTraining from '../training.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit , OnDestroy {
  
 // @Output() trainingStart=new EventEmitter<void>();
   //exercises: Exercise[]=[];
    exercises$: Observable<Exercise[]>;
    private exerciseSubscription : Subscription;
    private loadingSubscription : Subscription;
    isLoading$ : Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private db:AngularFirestore,
    private uiService : UiService,
    //private store : Store<fromRoot.State>
    private store : Store<fromTraining.State>
    ) { }

  ngOnInit() {
   // this.exercises=this.trainingService.getAvailableExercises();
   /* this.loadingSubscription = this.uiService.loadingStateSchanged.
   subscribe(isLoading=>{
     this.isLoading = isLoading;
   }); */
   this.isLoading$ = this.store.select(fromRoot.getIsLoading);
   /* this.exerciseSubscription=this.trainingService.exercisesChanged.subscribe(
     exercises=>{
        this.exercises=exercises;
   }); */
   this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
   
    this.fetchExercises();
  }

  fetchExercises(){
    this.trainingService.fetchAvailableExercises(); 
  }
   
  onstartTraining(form :NgForm)
  {
     //this.trainingStart.emit();
     this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(){
    if(this.exerciseSubscription){
      this.exerciseSubscription.unsubscribe();
    }
    /* if(this.loadingSubscription){
      this.loadingSubscription.unsubscribe();
    } */
  }
}
