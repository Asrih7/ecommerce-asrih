import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleCommandComponent } from './single-command.component';

const routes: Routes = [
  { path: '', component: SingleCommandComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleCommandRoutingModule { }