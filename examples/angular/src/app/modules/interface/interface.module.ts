import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InterfaceComponent } from './interface.component';

const routes: Routes = [
  {
    path: '',
    component: InterfaceComponent
  }
]

@NgModule({
  declarations: [
    InterfaceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    SharedModule
  ]
})
export class InterfaceModule { }
