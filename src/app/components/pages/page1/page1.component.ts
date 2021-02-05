import { Component, OnInit } from '@angular/core';
import { TabServiceService } from '../../../services/tab-service.service';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.css']
})
export class Page1Component implements OnInit {

  constructor(
    private tabService:TabServiceService
  ) { }

  ngOnInit(): void {
    this.tabService.getTest().subscribe({
      next:response =>{
        console.log(response);
      },
      error:err => {
        console.warn('Error getting test data:',err);
      }
    });
  }

}
