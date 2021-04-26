import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormBuilderModule } from '@jaspero/form-builder';
import { HighlightModule } from 'ngx-highlightjs';
import { SharedModule } from '../../shared/shared.module';
import { FieldComponent } from './components/field/field.component';
import { FieldsComponent } from './fields.component';

const routes: Routes = [
  {
    path: '',
    component: FieldsComponent
  },
  {
    path: ':id',
    component: FieldComponent
  }
]

@NgModule({
  declarations: [
    FieldsComponent,
    FieldComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormBuilderModule,
    HighlightModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FieldsModule { }
