import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateShopComponent } from './create-shop.component';
import { canActivateRoute } from 'src/@core/guards/can-activate-route';

const routes: Routes = [
  {
    path: 'create-shop',
    canActivate: [canActivateRoute],
    component: CreateShopComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateShopRoutingModule { }
