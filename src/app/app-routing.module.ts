import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { cloneHeaderTuple } from 'src/@core/utils/helpers';
import { canActivateRoute } from 'src/@core/guards/can-activate-route';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'confirm-password-reset/:uidb64/:token',
    loadChildren: () => import('./features/account/confirm-password-reset/confirm-password-reset.module').then(m => m.ConfirmPasswordResetModule)
  },
  {
    path: 'legal',
    loadChildren: () => import('./features/legal/legal.module').then(m => m.LegalModule)
  },
  {
    path: 'account',
    canActivate: [canActivateRoute],
    loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'messages',
    canActivate: [canActivateRoute],
    loadChildren: () => import('./features/messages/messages.module').then(m => m.MessagesModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./features/account/forget-password/forget-password.module').then(m => m.ForgetPasswordModule)
  },
  {
    path: 'wishlist',
    canActivate: [canActivateRoute],
    loadChildren: () => import('./features/wishlist/wishlist.module').then(m => m.WishlistModule)
  },
  {
    path: 'basket',
    loadChildren: () => import('./features/basket/basket.module').then(m => m.BasketModule)
  },
  {
    path: 'checkout',
    canActivate: [canActivateRoute],
    loadChildren: () => import('./features/checkout/checkout.module').then(m => m.CheckoutModule)
  },
  {
    path: "shop",
    canActivate: [canActivateRoute],
    loadChildren: () => import('./features/create-shop/create-shop.module').then(m => m.CreateShopModule)
  },
  {
    path: 'shop/update-shop/:name',
    canActivate: [canActivateRoute],
    loadChildren: () => import('./features/update-shop/update-shop.module').then(m => m.UpdateShopModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule)
  },
  {
    path: "sell",
    loadChildren: () => import('./features/sell/sell.module').then(m => m.SellModule)
  },
  {
    path: "history",
    loadChildren: () => import('./features/history/history.module').then(m => m.HistoryModule)
  },
  {
    path: "faq",
    loadChildren: () => import('./features/faq/faq.module').then(m => m.FaqModule)
  },
  { path: 'single-command', loadChildren: () => import('./features/single-command/single-command.module').then(m => m.SingleCommandModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload',
    scrollOffset: cloneHeaderTuple
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
