import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {TabComponent} from './components/tab/tab.component';
import {TabService} from './services/tab-service.service';
import {CreateTabComponent} from './pages/create-tab/create-tab.component';
import {TabRoutingModule} from './tab.routing';
import { TabControlsComponent } from './components/tab-controls/tab-controls.component';

@NgModule({
  declarations: [
    TabComponent,
    CreateTabComponent,
    TabControlsComponent
  ],
  providers:[TabService],
  imports: [
    CommonModule,
    TabRoutingModule
  ]
})
export class TabsModule { }
