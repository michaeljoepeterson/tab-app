import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabViewerComponent } from './components/pages/tab-viewer/tab-viewer.component'
import {Page2Component} from './components/pages/page2/page2.component';
import {NotFoundComponent} from './components/pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: TabViewerComponent },
  { path: 'page2', component: Page2Component },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
