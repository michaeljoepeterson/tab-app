import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/pages/home-page/home-page.component'
import {NotFoundComponent} from './components/pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'create-tab/:tab', loadChildren:() => import('./tabs/tabs.module').then(m => m.TabsModule) },
  { path: 'create-tab', loadChildren:() => import('./tabs/tabs.module').then(m => m.TabsModule) },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
