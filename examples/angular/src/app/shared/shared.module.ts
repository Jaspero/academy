import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import {
  ClickOutsideModule,
  EnumKeyFormatModule,
  EnumModule,
  FormTouchOnHoverModule,
  LoadClickModule,
  SanitizeModule,
  StopPropagationModule
} from '@jaspero/ng-helpers';

const IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  RouterModule,

  /**
   * Material
   */
  MatSidenavModule,
  MatFormFieldModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  DragDropModule,
  MatCardModule,
  MatDividerModule,
  MatTooltipModule,
  MatTabsModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatDialogModule,
  MatSnackBarModule,
  MatListModule,
  MatTreeModule,

  /**
   * AngularFire
   */
  AngularFirestoreModule,
  AngularFireAuthModule,

  /**
   * Jp Helpers
   * https://github.com/Jaspero/ng-helpers
   */
  FormTouchOnHoverModule,
  LoadClickModule,
  StopPropagationModule,
  ClickOutsideModule,
  EnumModule,
  EnumKeyFormatModule,
  SanitizeModule,
];

const COMPONENTS: any[] = [];
const DIRECTIVES: any[] = [];

const PIPES: any[] = [];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  imports: [...IMPORTS],
  exports: [
    ...IMPORTS,
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES
  ]
})
export class SharedModule {
}
