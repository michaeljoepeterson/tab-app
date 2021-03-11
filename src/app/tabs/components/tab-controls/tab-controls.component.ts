import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TabService } from '../../services/tab-service.service';

@Component({
  selector: 'app-tab-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab-controls.component.html',
  styleUrls: ['./tab-controls.component.css']
})
export class TabControlsComponent implements OnInit {
  isUpdating:boolean = false;

  constructor(
    private tabService:TabService
  ) { }

  ngOnInit(): void {
  }

  saveTab(){
    this.tabService.saveTab().subscribe(response => response);
  }

}
