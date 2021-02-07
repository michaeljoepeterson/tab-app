import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab-viewer.component.html',
  styleUrls: ['./tab-viewer.component.css']
})
export class TabViewerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
