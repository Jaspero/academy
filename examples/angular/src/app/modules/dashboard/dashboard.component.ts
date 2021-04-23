import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Academy from '@jaspero/academy';
import { FormBuilderComponent, FormBuilderData } from '@jaspero/form-builder';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { StateService } from '../../shared/services/state/state.service';

interface FieldData {
  id: string;
  name: string;
  interface: string;
  template: string;
}

interface InterfaceData {
  name: string;
  code: string;
}

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  constructor(
    private snack: MatSnackBar,
    private afs: AngularFirestore,
    private state: StateService
  ) {
  }

  @ViewChild('fb')
  formBuilder: FormBuilderComponent;

  academy: Academy;

  type = 'monaco';
  update$ = new BehaviorSubject(true);
  builderData$: Observable<FormBuilderData>;

  stepControl: FormControl;

  description$ = new BehaviorSubject('');

  // toc: any = [
  //   // {
  //   //   name: 'Introduction',
  //   //   children: [
  //   //     // {
  //   //     //   name: 'Intro',
  //   //     //   value: 'Intro'
  //   //     // },
  //   //     // {
  //   //     //   name: 'Schema',
  //   //     //   value: 'Schema'
  //   //     // },
  //   //     // {
  //   //     //   name: 'Layout',
  //   //     //   value: 'Layout'
  //   //     // },
  //   //     // {
  //   //     //   name: 'Definitions',
  //   //     //   value: 'Definitions'
  //   //     // },
  //   //     // {
  //   //     //   name: 'Example Overview',
  //   //     //   value: 'Example Overview'
  //   //     // },
  //   //     // {
  //   //     //   name: 'Schema Properties',
  //   //     //   value: 'Schema#1'
  //   //     // }
  //   //   ]
  //   // },
  //   {
  //     name: 'Fields',
  //     children: []
  //   }
  // ];

  fields$: Observable<any>;
  field$: Observable<any>;

  ngOnInit() {

    this.academy = new Academy({
      mount: [
        {
          type: 'description'
        },
        {
          type: 'editor'
        },
        {
          type: 'result',
          element: 'fb-form-builder'
        }
      ],
      editor: {
        monaco: {
          theme: 'vs-dark',
          language: 'typescript',
          // language: 'json',
          tabSize: 2
        }
      },
      notification: (message, error) => {
        this.snack.open(message, 'Dismiss', {
          duration: 3000
        });
      }
    });

    this.field$ = this.state.fieldControl.valueChanges.pipe(
      startWith(this.state.fieldControl.value),
      filter(item => item),
      switchMap(({id, name}) => {
        console.log({FIELD: id, name});
        return this.afs.doc<FieldData>(`fields/${id}/metadata/data`).get().pipe(
          map((snap) => {
            return {
              id,
              name,
              ...snap.data() as object,
            } as FieldData;
          }),
          switchMap((field) => {
            return this.afs.doc<InterfaceData>(`interfaces/${field.interface}`).get().pipe(
              map(interfaceData => {
                return {
                  ...field,
                  interface: interfaceData.data()?.code || ''
                };
              })
            );
          })
        );
      }),
      // switchMap((docs: any) => {
      //   return forkJoin(
      //     docs.map((doc: any) => {
      //       return this.afs.collection('interfaces').doc(doc.interface).get().pipe(
      //         map((inter) => {
      //           return {
      //             ...doc,
      //             code: (inter.data() as any).code
      //           };
      //         })
      //       );
      //     })
      //   );
      // }),
      // switchMap(field => {
      //
      // })
      tap((field: any) => {
        console.log({field});
        // this.toc[0].children.push(
        //   ...data.map((item: any) => {
        //     return {
        //       name: item.name,
        //       value: item.name
        //     };
        //   })
        // );

        // for (const step of data) {
        this.academy.clearSteps();
        this.academy.addStep({
          ...field,
          startWith: field.template,
          metadata: {
            interface: field.interface
          }
        });
        // }

        this.academy.nextStep(0);
        this.compile();

        this.description$.next(this.academy?.currentStep?.metadata?.interface || '');

        // this.stepControl.valueChanges.pipe(
        //   startWith(this.stepControl.value)
        // ).subscribe((name) => {
        //   this.academy?.nextStep(name);
        //   this.description$.next(this.academy?.currentStep?.metadata?.interface || '');
        //   this.compile();
        // });
      })
    );

    // this.stepControl = new FormControl('Autocomplete');

    // this.stepControl.setValue('Autocomplete');

    this.builderData$ = this.update$.pipe(
      map(() => {
        const search = 'const data: FormBuilderData = ';
        const value = this.academy.editor?.value || `{}`;

        const code = value.slice(value.indexOf(search) + search.length);

        let data: Partial<FormBuilderData & { layout: any }> = {
          schema: {},
          layout: {},
          definitions: {}
        };

        try {
          const compile = Function(`return ${code}`);

          data = {
            ...data,
            ...compile()
          };

          if (data?.layout?.instance?.segments) {
            data.segments = data.layout.instance.segments;
          }
        } catch (error) {
          console.log({error});
          this.snack.open(error.message || 'Invalid Schema Provided!', 'Dismiss', {
            duration: 3000
          });
        }

        const validate = this.formBuilder?.validate(data as FormBuilderData);

        if (validate?.error) {
          this.snack.open(validate.message, 'Dismiss', {
            duration: 3000
          });
        }

        return (validate && validate.error) ?
          {
            schema: {},
            value: {}
          } : data as FormBuilderData;
      })
    );

    // for (const step of STEPS) {
    //   this.academy.addStep({
    //     ...step
    //   });
    // }
    //
    // this.academy.nextStep(0);
  }

  validate() {
    if (!this.academy.currentStep) {
      return;
    }

    if (this.academy.valid) {
      this.academy.notify('Correct Solution!');
    } else {
      this.academy.notify('Invalid Solution', true);
    }
  }

  previous() {
    this.academy.previousStep();
    this.stepControl.setValue(this.academy.currentStep.name);
    this.compile();
  }

  next() {
    this.academy.nextStep();
    this.stepControl.setValue(this.academy.currentStep.name);
    this.compile();
  }

  compile() {
    this.update$.next(true);
  }
}
