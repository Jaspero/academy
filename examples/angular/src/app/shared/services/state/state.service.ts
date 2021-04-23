import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  fieldControl: FormControl;
  fields$: Observable<any>;

  constructor(
    private afs: AngularFirestore
  ) {

    this.fieldControl = new FormControl('');

    this.fields$ = this.afs.collection('fields').get().pipe(
      map((snap) => {
        return snap.docs.map(doc => {
          return {
            id: doc.id,
            ...(doc.data() as object)
          };
        });
      }),
      shareReplay(1)
    );
  }
}
