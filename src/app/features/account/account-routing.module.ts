import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';

const routes: Routes = [{
  path: '',
  component: AccountComponent
}, {
  path: 'wallet',
  component: AccountComponent
}, {
  path: 'settings',
  component: AccountComponent
},
{
  path: 'commandes',
  component: AccountComponent
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
