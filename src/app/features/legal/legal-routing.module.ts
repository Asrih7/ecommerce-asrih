import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CguComponent} from "./cgu/cgu.component";

const routes: Routes = [
    {
        path: 'terms-of-use',
        component: CguComponent
    },
    {
        path: 'privacy',
        loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyModule)
    },
    {
        path: 'cookies',
        loadChildren: () => import('./cookies/cookies.module').then(m => m.cookiesModule)
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LegalRoutingModule {
}
