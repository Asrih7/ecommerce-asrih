import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductSheetComponent } from './product-sheet/product-sheet.component';

const routes: Routes = [
  {
    path: 'view/:slug-id',
    component: ProductSheetComponent,
  },
  {
    path: 'search/:term',
    component: ProductsComponent,
  },
  {
    path: 'promotions',
    component: ProductsComponent,
  },
  {
    path: '**',
    component: ProductsComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
