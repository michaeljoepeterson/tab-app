import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {AuthService} from '../../../services/auth-service.service';

@Component({
  selector: 'app-create-tab',
  templateUrl: './create-tab.component.html',
  styleUrls: ['./create-tab.component.css']
})
export class CreateTabComponent implements OnInit {
  currentToken:string = null;
  subscribers:Subscription[] = [];

  constructor(
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    let tokenSub = this.authService.currentToken.subscribe(token => {
      this.currentToken = token;
      console.log(this.currentToken);
    });
    this.subscribers.push(tokenSub);
  }

  ngOnDestroy(){
    try{
      this.subscribers.forEach(sub => sub.unsubscribe());
    }
    catch(e){
      console.warn('Error cleaning up: ',e);
    }
  }
}
