import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from './services/auth-guard/auth.guard';
import { RedirectGuard } from './services/redirect-guard/redirect.guard';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [RedirectGuard] },
  { path: 'login', component: LoginComponent, canActivate: [RedirectGuard] },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
