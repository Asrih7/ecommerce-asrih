import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateShopComponent } from './update-shop.component';
import { ProductDetailModule } from './product-detail/product-detail.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  {
    path: '',
    component: UpdateShopComponent,    
  },
  {
    path:'create-product',
    component:ProductDetailComponent
  },
  {
    path:'update-product/:slug-id',
    component:ProductDetailComponent
  }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateShopRoutingModule { }
