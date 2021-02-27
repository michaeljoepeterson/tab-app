import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TabComponent} from './components/tab/tab.component';
import {TabService} from './services/tab-service.service';
import {CreateTabComponent} from './pages/create-tab/create-tab.component';
import {TabRoutingModule} from './tab.routing';

@NgModule({
  declarations: [
    TabComponent,
    CreateTabComponent
  ],
  providers:[TabService],
  imports: [
    CommonModule,
    TabRoutingModule
  ]
})
export class TabsModule { }
