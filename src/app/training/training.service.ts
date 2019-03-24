import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map , take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
//import * as fromRoot from '../app.reducer';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  
  exerciseChanged=new Subject<Exercise>();
  exercisesChanged=new Subject<Exercise[]>();
  finishedexercisesChanged=new Subject<Exercise[]>();
  private availableExercises: Exercise[]= [];  
  private runningExercise: Exercise;
  private fbSubs: Subscription[]=[];
  //private finishedExercises: Exercise[]=[];


  constructor(
    private db: AngularFirestore , 
    private uiService : UiService ,
    //private store : Store<fromRoot.State>
    private store : Store<fromTraining.State>,
    private afAuth: AngularFireAuth , 
    ) { }

  fetchAvailableExercises(){
    //return this.availableExercise.slice();
   //this.uiService.loadingStateSchanged.next(true);
   this.store.dispatch(new UI.StartLoading()) ;
   this.fbSubs.push(this.db.collection('availableExercises').snapshotChanges().pipe(
      map(docArray => {
     // throw(new Error()); 
      return docArray.map(doc => {
      const data = doc.payload.doc.data() as Exercise;
      const id = doc.payload.doc.id;
      return {
      id, ...data
      };
      });
      }))
      .subscribe((exercises: Exercise[])=>{
        //this.uiService.loadingStateSchanged.next(false);
        this.store.dispatch(new UI.StopLoading()) ;
        // this.availableExercises=exercises;
        // this.exercisesChanged.next([ ...this.availableExercises ]);
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error=>{
        //this.uiService.loadingStateSchanged.next(false);
        this.store.dispatch(new UI.StopLoading()) ;
        this.uiService.showSnamckBar('Fetching Exercises failed , please try later',null,5000);
        //this.exercisesChanged.next(null);
      }));
  }

  startExercise(selectedId: string){
    //this.db.doc('availableExercises/'+ selectedId).update({lastSelected : new Date()});
   //  this.runningExercise=this.availableExercises.find(ex=>ex.id===selectedId);
   //  this.exerciseChanged.next({ ...this.runningExercise });
   this.store.dispatch(new Training.StartTraining(selectedId));
  }

 /*  getRunningExercise(){
    return { ...this.runningExercise };
  } */

  completeExercise(){
   // this.exercises.push
   this.store.select(fromTraining.getActiveTraining).pipe(take(1))
   .subscribe(ex=>{
    this.addDataToDatabase({ 
       ...ex,
       date:new Date(), 
       state: 'completed'
      });
      this.store.dispatch(new Training.StopTraining());
   });
   /*  this.addDataToDatabase({ 
      ...this.runningExercise ,
       date:new Date(), 
       state: 'completed'
      }); */
   // this.runningExercise = null;
   // this.exerciseChanged.next(null);
  // this.store.dispatch(new Training.StopTraining());
  }

  cancelExercise(progress: number){
   // this.exercises.push
   this.store.select(fromTraining.getActiveTraining).pipe(take(1))
   .subscribe(ex=>{
    this.addDataToDatabase({ 
      ...ex , 
      duration: ex.duration * (progress / 100) ,
      calories: ex.calories * (progress /100),
      date:new Date(), 
      state: 'cancelled'
    });
    this.store.dispatch(new Training.StopTraining());
   });
    /* this.addDataToDatabase({ 
      ...this.runningExercise , 
      duration: this.runningExercise.duration * (progress / 100) ,
      calories: this.runningExercise.calories * (progress /100),
      date:new Date(), 
      state: 'cancelled'
    }); */
   // this.runningExercise = null;
   // this.exerciseChanged.next(null);
   //this.store.dispatch(new Training.StopTraining());

  }

  fetchCompletedOrCancelledExercises(){
    //this.uiService.loadingStateSchanged.next(true);
    this.store.dispatch(new UI.StartLoading()) ;
    this.fbSubs.push(this.db.collection(`newfinishedExercises/`+this.afAuth.auth.currentUser.uid+`/`+this.afAuth.auth.currentUser.uid).valueChanges()
    .subscribe((exercises : Exercise[])=>{
       // this.uiService.loadingStateSchanged.next(false);
       // this.finishedexercisesChanged.next(exercises);
       this.store.dispatch(new UI.StopLoading()) ;
       this.store.dispatch(new Training.SetFinishedTrainings(exercises));
    }, error=>{
      //this.uiService.loadingStateSchanged.next(false);
      this.store.dispatch(new UI.StopLoading()) ;
      this.uiService.showSnamckBar('Fetching Exercises failed , please try later',null,5000);
    }));
  }

  cancelSubscriptions(){
        this.fbSubs.forEach(sub=> sub.unsubscribe());
  }

  private addDataToDatabase(exercise : Exercise){
      // this.db.collection('finishedExercises').add(exercise);
       this.db.collection('newfinishedExercises')
       .doc(this.afAuth.auth.currentUser.uid)
       .collection(this.afAuth.auth.currentUser.uid)
       .add({...exercise});
  }

  
}
