import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilderComponent, FormBuilderData } from '@jaspero/form-builder';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, pluck, switchMap, tap } from 'rxjs/operators';
import Academy from '../../../../../../../../dist';

interface FieldData {
  id: string;
  name: string;
  interface: string;
  template: string;
  fb?: FormBuilderData;
}

interface InterfaceData {
  name: string;
  code: string;
}

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private snack: MatSnackBar,
    private router: Router
  ) {
  }

  academy: Academy;
  field$: Observable<FieldData>;

  @ViewChild('fb')
  formBuilder: FormBuilderComponent;

  update$ = new BehaviorSubject(true);

  ngOnInit(): void {
    this.field$ = this.route.params.pipe(
      pluck('id'),
      switchMap(id => {
        return this.afs.doc<FieldData>(`fields/${id}/metadata/data`).get().pipe(
          map((snap) => {
            if (!snap.exists) {
              this.router.navigate(['/fields']);
            }

            return {
              id,
              ...snap.data()
            };
          }),
          switchMap((field) => {
            return this.afs.doc<InterfaceData>(`interfaces/${field.interface}`).get().pipe(
              map(snap => {
                return {
                  ...field,
                  interface: snap.data()?.code || ''
                };
              }),
              switchMap((field) => {
                return combineLatest([of(field), this.update$]).pipe(
                  map(([field]) => {
                    const search = 'const data: FormBuilderData = ';
                    const value = (this.academy?.editor?.value || field.template) || `{}`;

                    const code = value.slice(value.indexOf(search) + search.length);

                    let data: Partial<FormBuilderData & { layout: any }> = {
                      value: {},
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

                    return {
                      ...field,
                      fb: (validate && validate.error) ?
                        {
                          schema: {},
                          value: {}
                        } : data as FormBuilderData
                    };
                  })
                );
              })
            );
          })
        );
      }),
      tap(field => {

        setTimeout(() => {

          if (!this.academy) {
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
                  tabSize: 2
                }
              },
              notification: (message, error) => {
                this.snack.open(message, 'Dismiss', {
                  duration: 3000
                });
              }
            });

            this.academy.clearSteps();
            this.academy.addStep({
              ...field,
              startWith: field.template,
              metadata: {
                interface: field.interface
              }
            });

            this.academy.nextStep(0);
            this.compile();
          }
        });
      })
    );
  }

  validate() {
    if (!this.academy?.currentStep) {
      return;
    }

    if (this.academy?.valid) {
      this.academy?.notify('Correct Solution!');
    } else {
      this.academy?.notify('Invalid Solution', true);
    }
  }

  previous() {
    this.academy.previousStep();
    this.compile();
  }

  next() {
    this.academy.nextStep();
    this.compile();
  }

  compile() {
    this.update$.next(true);
  }
}
