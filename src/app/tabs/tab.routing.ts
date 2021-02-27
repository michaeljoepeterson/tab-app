import { CreateTabComponent } from './pages/create-tab/create-tab.component'
import { Routes, RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'

export const routes: Routes = [
  { path: '', component: CreateTabComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TabRoutingModule { }
  